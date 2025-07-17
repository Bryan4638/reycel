import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface MonthlyData {
  month: string;
  total: number;
}

export const generalData = async (req: Request, res: Response) => {
  try {
    const functionPromise = (tabla: string) => {
      const query = `
        SELECT
            TO_CHAR("createdAt", 'Month') AS month,
            COUNT(*) AS total
        FROM
            "${tabla}"
        GROUP BY
            TO_CHAR("createdAt", 'Month')
        ORDER BY
            MIN("createdAt");
      `;
      return prisma.$queryRawUnsafe(query);
    };

    const [product, users, order] = (await Promise.all([
      functionPromise("Product"),
      functionPromise("BaseUser"),
      functionPromise("Order"),
    ])) as { month: string; total: string }[][];

    const functionFormatData = (
      data: Array<{ month: string; total: string }>
    ) => {
      return data.map((row) => ({
        month: row.month.trim(),
        total: parseInt(row.total),
      }));
    };

    const functionGrowth = (data: Array<MonthlyData>) => {
      const lastMonth = data[data.length - 1];
      const previousMonth = data[data.length - 2];

      let growthData = 0;
      if (previousMonth && lastMonth) {
        growthData =
          ((lastMonth.total - previousMonth.total) / previousMonth.total) * 100;
      }
      return growthData;
    };

    const formattedProduct = functionFormatData(product);
    const formattedUser = functionFormatData(users);
    const formattedOrder = functionFormatData(order);

    const growthProduct = functionGrowth(formattedProduct);
    const growthUser = functionGrowth(formattedUser);
    const growthOrder = functionGrowth(formattedOrder);

    res.status(200).json({
      dataProductsByMonth: formattedProduct,
      dataUsersByMonth: formattedUser,
      dataCategoriesByMonth: formattedOrder,
      growthProducts: growthProduct,
      growthUsers: growthUser,
      growthCategories: growthOrder,
      totalProduct: 166,
      totalUser: 13,
      totalCategory: 3,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const paymentsRequest = async (req: Request, res: Response) => {
  const { startDate, endDate } = req.body;

  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ error: "Both startDate and endDate are required." });
  }

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: "Invalid date format." });
    }

    const functionPromise = async (startDate: string, endDate: string) => {
      const getFormatedDate = (date: string) => {
        const fechaGMT = new Date(date);
        const año = fechaGMT.getFullYear();
        const mes = String(fechaGMT.getMonth() + 1).padStart(2, "0");
        const dia = String(fechaGMT.getDate()).padStart(2, "0");
        return `${año}-${mes}-${dia}`;
      };

      const start = getFormatedDate(startDate);
      const end = getFormatedDate(endDate);

      const query = `
       WITH 
       date_filter AS (
            SELECT 
                date_trunc('month', '${start}'::date) AS start_date,
                date_trunc('month', '${end}'::date) AS end_date
        ),
        months_series AS (
            SELECT generate_series(
                (SELECT start_date FROM date_filter),
                (SELECT end_date FROM date_filter),
                interval '1 month'
            ) AS month_year
        )
        SELECT
            EXTRACT(YEAR FROM ms.month_year)::integer AS year,
            TO_CHAR(ms.month_year, 'TMMonth') AS month_name,
            COALESCE(SUM(sf.investment_price), 0) AS monthly_investments,
            COALESCE(SUM(sf.total_amount), 0) AS monthly_revenue,
            COALESCE(SUM(sf.total_amount - sf.investment_price), 0) AS gross_profit
        FROM 
            months_series ms
        LEFT JOIN 
            sales_facts sf ON date_trunc('month', sf.transaction_date) = ms.month_year
        GROUP BY
            year,
            month_name,
            ms.month_year
        ORDER BY 
            ms.month_year;
      `;
      return await prisma.$queryRawUnsafe(query);
    };

    const data = (await functionPromise(startDate, endDate)) as {
      month_name: string;
      monthly_investments: string;
      monthly_revenue: string;
      gross_profit: string;
    }[];

    const functionFormatData = (
      data: Array<{
        month_name: string;
        monthly_investments: string;
        monthly_revenue: string;
        gross_profit: string;
      }>
    ) => {
      return data.map((row) => ({
        month: row.month_name.trim(),
        Invercion: parseInt(row.monthly_investments),
        Monto_en_Ventas: parseInt(row.monthly_revenue),
        GananciasBrutas: parseInt(row.gross_profit),
      }));
    };

    res.status(200).json({
      chartData: functionFormatData(data),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

//Productos mas vendidos
export const bestSellingProduct = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.body;

    const query = `
    SELECT
        p.name AS product_name,
        SUM(sf.quantity) AS total_sold,
        SUM(sf.total_amount) AS total_revenue
    FROM sales_facts sf
    JOIN "Product" p ON sf.product_id = p.id
    WHERE sf.transaction_date BETWEEN '${startDate}' AND '${endDate}'
    GROUP BY
        p.name
    ORDER BY total_sold DESC
    LIMIT 5;
    `;
    const data = (await prisma.$queryRawUnsafe(query)) as Array<{
      product_name: string;
      total_sold: string;
      total_revenue: string;
    }>;

    const functionFormatData = (
      data: Array<{
        product_name: string;
        total_sold: string;
        total_revenue: string;
      }>
    ) => {
      return data.map((row) => ({
        name: row.product_name,
        total_sold: parseInt(row.total_sold),
        total_revenue: parseInt(row.total_revenue),
      }));
    };

    res.status(200).json({
      chartData: functionFormatData(data),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const leastSoldProduct = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.body;

    const query = `
    SELECT 
        p.name AS product_name,
        SUM(sf.quantity) AS total_sold
    FROM 
        sales_facts sf
    JOIN 
        "Product" p ON sf.product_id = p.id
    WHERE sf.transaction_date BETWEEN '${startDate}' AND '${endDate}'
    GROUP BY 
        p.name
    HAVING 
        SUM(sf.quantity) > 0
    ORDER BY 
        total_sold ASC
    LIMIT 5;
    `;
    const data = (await prisma.$queryRawUnsafe(query)) as Array<{
      product_name: string;
      total_sold: string;
      total_revenue: string;
    }>;

    const functionFormatData = (
      data: Array<{
        product_name: string;
        total_sold: string;
        total_revenue: string;
      }>
    ) => {
      return data.map((row) => ({
        name: row.product_name,
        total_sold: parseInt(row.total_sold),
        total_revenue: parseInt(row.total_revenue),
      }));
    };

    res.status(200).json({
      chartData: functionFormatData(data),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const sedeWithMostSales = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.body;

    const query = `
    SELECT 
        s.direction AS sede_name,
        SUM(sf.quantity) AS total_products_sold,
        SUM(sf.total_amount) AS total_revenue
    FROM 
        sales_facts sf
    JOIN 
        "Sede" s ON sf.sede_id = s.id
    WHERE sf.transaction_date BETWEEN '${startDate}' AND '${endDate}'
    GROUP BY 
        s.direction
    ORDER BY 
        total_products_sold DESC
    LIMIT 5;
    `;
    const data = (await prisma.$queryRawUnsafe(query)) as Array<{
      sede_name: string;
      total_products_sold: string;
      total_revenue: string;
    }>;

    const functionFormatData = (
      data: Array<{
        sede_name: string;
        total_products_sold: string;
        total_revenue: string;
      }>
    ) => {
      return data.map((row) => ({
        name: row.sede_name,
        total_sold: parseInt(row.total_products_sold),
        total_revenue: parseInt(row.total_revenue),
      }));
    };

    res.status(200).json({
      chartData: functionFormatData(data),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const sedeWithLeastSales = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.body;

    const query = `
    SELECT 
        s.direction AS sede_name,
        SUM(sf.quantity) AS total_products_sold,
        SUM(sf.total_amount) AS total_revenue
    FROM 
        sales_facts sf
    JOIN 
        "Sede" s ON sf.sede_id = s.id
    WHERE sf.transaction_date BETWEEN '${startDate}' AND '${endDate}'
    GROUP BY 
        s.direction
    ORDER BY 
        total_products_sold ASC
    LIMIT 5;
    `;
    const data = (await prisma.$queryRawUnsafe(query)) as Array<{
      sede_name: string;
      total_products_sold: string;
      total_revenue: string;
    }>;

    const functionFormatData = (
      data: Array<{
        sede_name: string;
        total_products_sold: string;
        total_revenue: string;
      }>
    ) => {
      return data.map((row) => ({
        name: row.sede_name,
        total_sold: parseInt(row.total_products_sold),
        total_revenue: parseInt(row.total_revenue),
      }));
    };

    res.status(200).json({
      chartData: functionFormatData(data),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};
