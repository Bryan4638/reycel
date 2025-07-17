// script.js

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface CategoryData {
  name: string;
}
async function main() {
  // Crear categorías
  const categoriesData: CategoryData[] = [
    { name: "Watch Accessories" }, // cat-1
    { name: "Chargers" }, // cat-2
    { name: "Earphones" }, // cat-3
    { name: "Mice" }, // cat-4
    { name: "Controllers" }, // cat-5
    { name: "Phone Cases" }, // cat-6
    { name: "Memory Storage" }, // cat-7
    { name: "Adapters" }, // cat-8
    { name: "Car Chargers" }, // cat-9
    { name: "Phone Accessories" }, // cat-10
    { name: "Cables" }, // cat-11
    { name: "Camera Protectors" }, // cat-12
    { name: "Power Banks" }, // cat-13
    { name: "Smart Watches" }, // cat-14
    { name: "Batteries" }, // cat-15
    { name: "Keyboards" }, // cat-16
    { name: "Wireless Earphones" }, // cat-17
    { name: "Headphones" }, // cat-18
    { name: "Smartphones" },
  ];

  // Insertar categorías y mapear nombres a IDs
  const categoriesMap: Record<string, string> = {};

  for (const categoryData of categoriesData) {
    const category = await prisma.category.create({
      data: categoryData,
    });
    categoriesMap[category.name] = category.id;
  }

  // Datos de productos con categoryId actualizados
  const productsData = [
    {
      name: "Manillas de relojes Miban",
      description: "Correas para relojes Miban.",
      imagen: "https://m.media-amazon.com/images/I/81Pzsse6JFL._AC_SY500_.jpg",
      price: 7.0,
      categoryId: categoriesMap["Watch Accessories"],
      investment: 4,
    },
    {
      name: "Cargadores de relojes Miban",
      description: "Cargadores para relojes Miban.",
      imagen: "https://m.media-amazon.com/images/I/51BJiFN4wpL._SL1000_.jpg",
      price: 7.0,
      categoryId: categoriesMap["Chargers"],
      investment: 4,
    },
    {
      name: "Cargadores de reloj redondo",
      description: "Cargadores para relojes redondos.",
      imagen: "https://m.media-amazon.com/images/I/41llLZM3HTL._AC_SL1200_.jpg",
      price: 8.0,
      categoryId: categoriesMap["Chargers"],
      investment: 5,
    },
    {
      name: "Cargador fly (micro y tipo C) completo",
      description: "Cargador fly con micro y tipo C completo.",
      price: 12.0,
      imagen:
        "https://m.media-amazon.com/images/I/71yUVO4PktL._AC_UF1000,1000_QL80_.jpg",
      categoryId: categoriesMap["Chargers"],
      investment: 8,
    },
    {
      name: "Cargador fly piña sola",
      description: "Adaptador (piña) del cargador fly.",
      price: 7.0,
      imagen:
        "https://cdn.quicksell.co/-M5mfJ9Y8f2UdhwcIe3E/products/-NQCVY0CxM0tXyHTwq09.jpg",
      categoryId: categoriesMap["Chargers"],
      investment: 4,
    },
    {
      name: "Cargador fly cable solo",
      description: "Cable del cargador fly.",
      price: 5.0,
      imagen:
        "https://http2.mlstatic.com/D_NQ_NP_825517-MCO74549447467_022024-O.webp",
      categoryId: categoriesMap["Cables"],
      investment: 3,
    },
    {
      name: "Cargador Harvic (tipo C y micro) completo",
      description: "Cargador Harvic con tipo C y micro completo.",
      price: 10.0,
      imagen:
        "https://cdn.quicksell.co/-MDLfK-fgx0tgM9YssWH/products/-O0RKyNsG-TJdJFoZVy7.jpg",
      categoryId: categoriesMap["Chargers"],
      investment: 6,
    },
    {
      name: "Cargador Harvic piña sola",
      description: "Adaptador (piña) del cargador Harvic.",
      price: 5.0,
      imagen:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRe8bcnixxCzsfLpF7eL1x-hdeHXNZWZL54Tg&s",
      categoryId: categoriesMap["Chargers"],
      investment: 3,
    },
    {
      name: "Cargador Harvic cable solo",
      description: "Cable del cargador Harvic.",
      price: 5.0,
      imagen:
        "https://moalotech.com/wp-content/uploads/cable-harvic-tipo-c.png",
      categoryId: categoriesMap["Cables"],
      investment: 3,
    },
    {
      name: "Cargador Xiaomi 67W completo",
      description: "Cargador completo Xiaomi de 67W.",
      price: 20.0,
      imagen: "https://i.blogs.es/c3c8ec/mi-67w-soniccharge-2/840_560.jpg",
      categoryId: categoriesMap["Chargers"],
      investment: 13,
    },
    {
      name: "Cargador Xiaomi 67W piña sola",
      description: "Adaptador (piña) del cargador Xiaomi 67W.",
      price: 13.0,
      imagen:
        "https://f.fcdn.app/imgs/afc6b8/www.market.com.uy/markuy/0139/original/catalogo/6934177733769_2/460x460/cargador-xiaomi-67w-usb-c-v01.jpg",
      categoryId: categoriesMap["Chargers"],
      investment: 8,
    },
    {
      name: "Cargador Xiaomi 67W cable solo",
      description: "Cable del cargador Xiaomi 67W.",
      price: 7.0,
      imagen:
        "https://celularesmiibague.com/wp-content/uploads/2021/09/cable-carga-5.jpg",
      categoryId: categoriesMap["Cables"],
      investment: 4,
    },
    {
      name: "Cargador de iPhone 5W completo",
      description: "Cargador completo de iPhone 5W.",
      price: 12.0,
      imagen:
        "https://imagedelivery.net/4fYuQyy-r8_rpBpcY7lH_A/falabellaPE/120501831_01/w=1500,h=1500,fit=pad",
      categoryId: categoriesMap["Chargers"],
      investment: 8,
    },
    {
      name: "Cargador de iPhone 5W piña sola",
      description: "Adaptador (piña) del cargador de iPhone 5W.",
      price: 7.0,
      imagen:
        "https://acdn.mitiendanube.com/stores/001/364/808/products/fuente-cargador-iphone-apple-100-original-usb-5w-d_nq_np_626591-mla29972569834_042019-f1-6c1ece7b0dd7a47c3e15891286925481-640-0-e997ca2deb6d0ababa17081019089191-1024-1024.jpg",
      categoryId: categoriesMap["Chargers"],
      investment: 4,
    },
    {
      name: "Cargador de iPhone 5W cable solo",
      description: "Cable del cargador de iPhone 5W.",
      price: 5.0,
      imagen:
        "https://i5.walmartimages.com/asr/c205685f-6f06-4ae2-8e69-ff86a8e08391.8afe6e63f464ada74f13c9fefa873cb2.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
      categoryId: categoriesMap["Cables"],
      investment: 3,
    },
    {
      name: "Cargador iPhone tipo C a Lightning de 20W completo",
      description: "Cargador de iPhone tipo C a Lightning de 20W completo.",
      price: 20.0,
      imagen:
        "https://www.tiendaelectronica.uy/imgs/productos/_original_6561.jpg",
      categoryId: categoriesMap["Chargers"],
      investment: 13,
    },
    {
      name: "Cargador iPhone 20W piña sola",
      description: "Adaptador (piña) del cargador iPhone 20W.",
      price: 13.0,
      imagen:
        "https://tecnologia-enlinea.com/wp-content/uploads/2023/09/D_NQ_NP_867047-MLA51164790808_082022-O.webp",
      categoryId: categoriesMap["Chargers"],
      investment: 8,
    },
    {
      name: "Cargador iPhone 20W cable solo",
      description: "Cable del cargador iPhone 20W.",
      price: 7.0,
      imagen:
        "https://http2.mlstatic.com/D_NQ_NP_965631-MLA70282190238_072023-O.webp",
      categoryId: categoriesMap["Cables"],
      investment: 4,
    },
    {
      name: "Cargador Samsung tipo C a tipo C 25W completo",
      description: "Cargador Samsung tipo C a tipo C de 25W completo.",
      price: 25.0,
      imagen: "https://www.toptecnouy.com/imgs/productos/productos34_32491.jpg",
      categoryId: categoriesMap["Chargers"],
      investment: 16,
    },
    {
      name: "Cargador Samsung 25W piña sola",
      description: "Adaptador (piña) del cargador Samsung 25W.",
      price: 18.0,
      imagen:
        "https://oechsle.vteximg.com.br/arquivos/ids/15032599-1000-1000/image-6bf7d49afe9d4964bdb4b10a37e0354c.jpg?v=638278879546500000",
      categoryId: categoriesMap["Chargers"],
      investment: 11,
    },
    {
      name: "Cargador Samsung 25W cable solo",
      description: "Cable del cargador Samsung 25W.",
      price: 7.0,
      imagen:
        "https://slink.com.ar/wp-content/uploads/2022/09/cargador-samsung-11.jpg",
      categoryId: categoriesMap["Cables"],
      investment: 4,
    },
    {
      name: "Cargador tipo C a tipo C 20W",
      description: "Cargador tipo C a tipo C de 20W, carga en 1 hora.",
      price: 20.0,
      imagen:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLudpr99azP6WIQFLDH7rZDA8PunpQAtw81Q&s",
      categoryId: categoriesMap["Chargers"],
      investment: 13,
    },
    {
      name: "Cargador tipo C a tipo C 30W",
      description: "Cargador tipo C a tipo C de 30W, carga en 1 hora.",
      price: 25.0,
      imagen:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRj3qB7Gc5JIPfkSTzaCg_cbFwlKXFIQKSo1A&s",
      categoryId: categoriesMap["Chargers"],
      investment: 16,
    },
    {
      name: "Cargador Samsung tipo C a tipo C 45W completo",
      description: "Cargador Samsung tipo C a tipo C de 45W completo.",
      price: 30.0,
      imagen:
        "https://f.fcdn.app/imgs/bdff80/www.zonatecno.com.uy/zoteuy/0c7b/original/catalogo/102792_102792_1/2000-2000/cargador-original-samsung-45w-con-cable-usb-c-cargador-original-samsung-45w-con-cable-usb-c.jpg",
      categoryId: categoriesMap["Chargers"],
      investment: 19,
    },
    {
      name: "Cargador Samsung 45W piña sola",
      description: "Adaptador (piña) del cargador Samsung 45W.",
      price: 23.0,
      imagen: "https://m.media-amazon.com/images/I/31dK34gDb0L._AC_.jpg",
      categoryId: categoriesMap["Chargers"],
      investment: 14,
    },
    {
      name: "Cargador Samsung 45W cable solo",
      description: "Cable del cargador Samsung 45W.",
      price: 7.0,
      imagen:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLudpr99azP6WIQFLDH7rZDA8PunpQAtw81Q&s",
      categoryId: categoriesMap["Cables"],
      investment: 4,
    },
    {
      name: "Manos libres AKG",
      description: "Auriculares AKG.",
      price: 4.0,
      imagen: "https://m.media-amazon.com/images/I/51OdN9xASsL.jpg",
      categoryId: categoriesMap["Earphones"],
      investment: 3,
    },
    {
      name: "Manos libres MI",
      description: "Auriculares MI.",
      price: 3.0,
      imagen: "https://m.media-amazon.com/images/I/517tnKPrGyL.jpg",
      categoryId: categoriesMap["Earphones"],
      investment: 2,
    },
    {
      name: "Manos libres de colores plásticos",
      description: "Auriculares de colores de plástico.",
      price: 3.0,
      imagen:
        "https://acdn.mitiendanube.com/stores/078/254/products/captura-de-pantalla-2023-06-14-a-las-12-22-211-9e9d13633e639e4c2b16867563993455-1024-1024.png",
      categoryId: categoriesMap["Earphones"],
      investment: 2,
    },
    {
      name: "Manos libres Mulazon",
      description: "Auriculares Mulazon.",
      price: 5.0,
      imagen:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDQv5x2sSKb2RYMMP-ZFpeV3t8vJRq5dL5hA&s",
      categoryId: categoriesMap["Earphones"],
      investment: 3,
    },
    {
      name: "Manos libres Zuga",
      description: "Auriculares Zuga.",
      price: 6.0,
      imagen:
        "https://onplay.com.ar/wp-content/uploads/2024/03/939-AURICULAR-MANOS-LIBRES-WOLLOW-TIMEK-CON-CABLE-500x500.jpg",
      categoryId: categoriesMap["Earphones"],
      investment: 4,
    },
    {
      name: "Manos libres Buytiti",
      description: "Auriculares Buytiti.",
      price: 5.0,
      imagen: "https://img.joinet.com/wp-content/uploads/2023/05/by-aud300.jpg",
      categoryId: categoriesMap["Earphones"],
      investment: 3,
    },
    {
      name: "Manos libres blanco S6 y J5",
      description: "Auriculares blancos para S6 y J5.",
      price: 2.0,
      imagen:
        "https://exitocol.vtexassets.com/arquivos/ids/10962327/audifonos-manos-libres-samsung-s7-s8-s6-a7-a5-j5-j7-blanco.jpg?v=637731988321700000",
      categoryId: categoriesMap["Earphones"],
      investment: 1,
    },
    {
      name: "Mouse inalámbrico",
      description: "Ratón inalámbrico.",
      price: 15.0,
      imagen:
        "https://www.steren.com.sv/media/catalog/product/cache/532829604b379f478db69368d14615cd/image/2133235b2/mouse-inalambrico-1000-dpi.jpg",
      categoryId: categoriesMap["Mice"],
      investment: 9,
    },
    {
      name: "Mouse gamer",
      description: "Ratón para gaming.",
      price: 24.0,
      imagen:
        "https://imagedelivery.net/4fYuQyy-r8_rpBpcY7lH_A/falabellaPE/120544237_01/w=800,h=800,fit=pad",
      categoryId: categoriesMap["Mice"],
      investment: 15,
    },
    {
      name: "Mandos universales",
      description: "Controles universales.",
      price: 12.0,
      imagen: "https://corpdrpa.com/wp-content/uploads/Untitled-design787.jpg",
      categoryId: categoriesMap["Controllers"],
      investment: 8,
    },
    {
      name: "Covers robóticos, argolla, accesorios o con pulsos",
      description: "Fundas robóticas, con argolla, accesorios o con pulsos.",
      price: 10.0,
      imagen:
        "https://imagedelivery.net/4fYuQyy-r8_rpBpcY7lH_A/falabellaPE/121383669_01/w=800,h=800,fit=pad",
      categoryId: categoriesMap["Phone Cases"],
      investment: 6,
    },
    {
      name: "Covers S",
      description: "Todos los covers S.",
      price: 10.0,
      imagen:
        "https://ae01.alicdn.com/kf/Sf5fd8f8cf3604a7faff6bb023281067eU.jpg_960x960.jpg",
      categoryId: categoriesMap["Phone Cases"],
      investment: 6,
    },
    {
      name: "Covers de iPhone",
      description: "Fundas para iPhone.",
      price: 10.0,
      imagen:
        "https://lh6.googleusercontent.com/proxy/TozzYQzs2Xc1JPH5uiDw4thDf6rHtFK5VCQm-V2wgQKBptmlkpPv5DLeUbiVfROYSL1O9uEf-clRm2X7AwmUUoPRmzRT6y55cJZY_VKuc1va6G67rP8bjOAAvQv55Snr4UO5eUXdGMf972c3vJ7XG9LjrmJur0k0CLt-u970XK32uGoFqE3d8wVOYH1HP1dRoyif5pnd3Qo",
      categoryId: categoriesMap["Phone Cases"],
      investment: 6,
    },
    {
      name: "Covers de iPhone con carga inalámbrica",
      description: "Fundas de iPhone con carga inalámbrica.",
      price: 12.0,
      imagen:
        "https://m.media-amazon.com/images/I/51yC3yEy6qL._AC_UF1000,1000_QL80_.jpg",
      categoryId: categoriesMap["Phone Cases"],
      investment: 8,
    },
    {
      name: "Cover gamuza silicona",
      description: "Fundas de gamuza de silicona.",
      price: 8.0,
      imagen:
        "https://http2.mlstatic.com/D_NQ_NP_749685-MLA74525645532_022024-O.webp",
      categoryId: categoriesMap["Phone Cases"],
      investment: 5,
    },
    {
      name: "Cover acuático",
      description: "Fundas acuáticas.",
      price: 10.0,
      imagen:
        "https://promart.vteximg.com.br/arquivos/ids/5925615-1000-1000/imageUrl_1.jpg?v=637904988118000000",
      categoryId: categoriesMap["Phone Cases"],
      investment: 6,
    },
    {
      name: "Cover de goma y plástico",
      description: "Fundas de goma y plástico.",
      price: 7.0,
      imagen:
        "https://ae01.alicdn.com/kf/S85b05ce2feb04eee9b5ee1a921716e8aV.jpg_960x960.jpg",
      categoryId: categoriesMap["Phone Cases"],
      investment: 4,
    },
    {
      name: "Cover de brazo",
      description: "Fundas de brazo.",
      price: 10.0,
      imagen:
        "https://m.media-amazon.com/images/I/61gJBDfDyfL._AC_UF894,1000_QL80_.jpg",
      categoryId: categoriesMap["Phone Cases"],
      investment: 6,
    },
    {
      name: "Cover de librito",
      description: "Fundas tipo libro.",
      price: 10.0,
      imagen:
        "https://http2.mlstatic.com/D_Q_NP_2X_629034-MLA80334343227_102024-T.webp",
      categoryId: categoriesMap["Phone Cases"],
      investment: 6,
    },
    {
      name: "Micro SD de 32 GB",
      description: "Tarjeta Micro SD de 32 GB.",
      price: 12.0,
      imagen: "https://m.media-amazon.com/images/I/71ojeUPQI9L.jpg",
      categoryId: categoriesMap["Memory Storage"],
      investment: 8,
    },
    {
      name: "USB de 32 GB",
      description: "Memoria USB de 32 GB.",
      price: 12.0,
      imagen:
        "https://plazavea.vteximg.com.br/arquivos/ids/1888344-512-512/image-647a4491f026438498920529b9eccc48.jpg",
      categoryId: categoriesMap["Memory Storage"],
      investment: 8,
    },
    {
      name: "USB de 64 GB",
      description: "Memoria USB de 64 GB.",
      price: 15.0,
      imagen:
        "https://offi.pe/image/catalog/PRODUCTOS/COMPUTADORAS%20IMPRESORAS/ALMACENAMIENTO/Memorias%20USB/memoria-usb-datatraveler-kyson-64gb-kingston.png",
      categoryId: categoriesMap["Memory Storage"],
      investment: 9,
    },
    {
      name: "Micro SD de 128 GB",
      description: "Tarjeta Micro SD de 128 GB.",
      price: 20.0,
      imagen:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmJ7AIKgztj8TFwFE9MJ2zhjlWua2bv_oY_Q&s",
      categoryId: categoriesMap["Memory Storage"],
      investment: 13,
    },
    {
      name: "Micro SD de 256 GB",
      description: "Tarjeta Micro SD de 256 GB.",
      price: 23.0,
      imagen:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJQef9lp1UWQ3EFOL7z6nDsApEQuplKpEWcQ&s",
      categoryId: categoriesMap["Memory Storage"],
      investment: 14,
    },
    {
      name: "Micro SD de 512 GB",
      description: "Tarjeta Micro SD de 512 GB.",
      price: 26.0,
      imagen:
        "https://portatilshoprd.com/wp-content/uploads/2024/02/61QkS94bG0L._AC_SL1000_.jpg",
      categoryId: categoriesMap["Memory Storage"],
      investment: 16,
    },
    {
      name: "Adaptador para Micro SD",
      description: "Adaptador para tarjeta Micro SD.",
      price: 7.0,
      imagen:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqo9mWigay-J3r4ojnHo9YJrf3jtTpeKbZSw&s",
      categoryId: categoriesMap["Adapters"],
      investment: 4,
    },
    {
      name: "Adaptador de Bluetooth",
      description: "Adaptador Bluetooth que parece memoria.",
      price: 7.0,
      imagen:
        "https://promart.vteximg.com.br/arquivos/ids/7485283-1000-1000/image-9e37428cc8fc428e99a44cc5f7113d1d.jpg?v=638307809503500000",
      categoryId: categoriesMap["Adapters"],
      investment: 4,
    },
    {
      name: "Adaptador Bluetooth con mando",
      description: "Adaptador Bluetooth con control remoto.",
      price: 15.0,
      imagen:
        "https://down-mx.img.susercontent.com/file/f7b98859ba9e50f7551dfca1553432cf",
      categoryId: categoriesMap["Adapters"],
      investment: 9,
    },
    {
      name: "Cargador de celular para el carro 1 entrada",
      description: "Cargador de auto con 1 entrada.",
      price: 7.0,
      imagen:
        "https://m.media-amazon.com/images/I/61kxiBSxrEL._AC_UF1000,1000_QL80_.jpg",
      categoryId: categoriesMap["Car Chargers"],
      investment: 4,
    },
    {
      name: "Cargador de celular para el carro 2 entradas con cable",
      description: "Cargador de auto con 2 entradas y cable.",
      price: 10.0,
      imagen: "https://m.media-amazon.com/images/I/41fJJm-t2qL._AC_.jpg",
      categoryId: categoriesMap["Car Chargers"],
      investment: 6,
    },
    {
      name: "Cargador de celular para el carro 5 entradas",
      description: "Cargador de auto con 5 entradas.",
      price: 15.0,
      imagen:
        "https://m.media-amazon.com/images/I/51Zwko+zWrS._AC_UF894,1000_QL80_.jpg",
      categoryId: categoriesMap["Car Chargers"],
      investment: 9,
    },
    {
      name: "PopSocket redonditos",
      description: "Soportes PopSocket redondos.",
      price: 1.0,
      imagen:
        "https://lh3.googleusercontent.com/proxy/8PCyKnjROboA2hVFngCObd8gLJqDqEEoHMJWoJxyNfYDrXrYEJdkJSXzLqYiXy5lK_vIN5qYmt1i4_iRRqqa7x6gqHsCbs-14CylCxfKBGRCA5R9xnbc0KHliAVT5QdEAH9lMqHFLuzLN-DUMZ5PiPw",
      categoryId: categoriesMap["Phone Accessories"],
      investment: 1,
    },
    {
      name: "PopSocket muñecos",
      description: "Soportes PopSocket con muñecos.",
      price: 3.0,
      imagen:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDL9HR1q7hr_IXgrx0ti7jlBB1VgCsk7t_xQ&s",
      categoryId: categoriesMap["Phone Accessories"],
      investment: 2,
    },
    {
      name: "PopSocket Astronauta",
      description: "Soporte PopSocket de astronauta.",
      price: 5.0,
      imagen:
        "https://cdn.quicksell.co/-M5mfJ9Y8f2UdhwcIe3E/products/-NRFDExneATgxVlvoNhU.jpg",
      categoryId: categoriesMap["Phone Accessories"],
      investment: 3,
    },
    {
      name: "PopSocket de espejo",
      description: "Soporte PopSocket con espejo.",
      price: 7.0,
      imagen:
        "https://down-co.img.susercontent.com/file/73f3f44353aa4094929ce9e8e46633bc",
      categoryId: categoriesMap["Phone Accessories"],
      investment: 4,
    },
    {
      name: "Adornos de teléfonos (pulsos)",
      description: "Adornos para teléfonos tipo pulsera.",
      price: 4.0,
      imagen:
        "https://i.pinimg.com/736x/41/65/2a/41652a3182071147cec284e646bcbe95.jpg",
      categoryId: categoriesMap["Phone Accessories"],
      investment: 3,
    },
    {
      name: "Collares de teléfono",
      description: "Collares para teléfono.",
      price: 5.0,
      imagen:
        "https://lh3.googleusercontent.com/proxy/rD6YYRGNF7EVK8Hkgn27QI5eQ6wXhBfzZ6dWleYQIBU4HW7dqRuTgGWwbxUtrBLU6QBLDH24lLxfXOucyH8IIrm07-WI-kxhaWxR8PHXzInIx5Vkag",
      categoryId: categoriesMap["Phone Accessories"],
      investment: 3,
    },
    {
      name: "Cable HDMI 1.5 m",
      description: "Cable HDMI de 1.5 metros.",
      price: 8.0,
      imagen:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnpj9AeMOgNQ7zEFlxPsFodWshREaofZj20A&s",
      categoryId: categoriesMap["Cables"],
      investment: 5,
    },
    {
      name: "Cable HDMI 3 m",
      description: "Cable HDMI de 3 metros.",
      price: 10.0,
      imagen:
        "https://mitecno.gt/image/cache/catalog/289-434/00299/Cable-HDMI-3-metros--550x550.jpg.webp",
      categoryId: categoriesMap["Cables"],
      investment: 6,
    },
    {
      name: "Cable de disco duro externo",
      description: "Cable para disco duro externo.",
      price: 7.0,
      imagen:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSbVZQHg7uvxUyF_OfQnn0_v_VeUXyvHb5ag&s",
      categoryId: categoriesMap["Cables"],
      investment: 4,
    },
    {
      name: "Extensión USB",
      description: "Extensión de cable USB.",
      price: 7.0,
      imagen:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTY1cD1L-JYZYuAoUL-aFFnc2_MSGyrvUpwjw&s",
      categoryId: categoriesMap["Cables"],
      investment: 4,
    },
    {
      name: "Cables DVD y cajita",
      description: "Cables para DVD y cajita digital.",
      price: 7.0,
      imagen: "https://m.media-amazon.com/images/I/41e41oSDkJL._AC_.jpg",
      categoryId: categoriesMap["Cables"],
      investment: 4,
    },
    {
      name: "Cables plus a plus",
      description: "Cables de plug a plug.",
      price: 7.0,
      imagen:
        "https://http2.mlstatic.com/D_NQ_NP_815820-MLV49999473346_052022-O.webp",
      categoryId: categoriesMap["Cables"],
      investment: 4,
    },
    {
      name: "Cables RCA x mini plus",
      description: "Cables RCA a mini plug.",
      price: 7.0,
      imagen:
        "https://promart.vteximg.com.br/arquivos/ids/2109218-1000-1000/10081408.jpg?v=637679260342900000",
      categoryId: categoriesMap["Cables"],
      investment: 4,
    },
    {
      name: "Protector de cámara iPhone 13 Pro Max y 14 Pro Max",
      description: "Protector de cámara para iPhone 13 Pro Max y 14 Pro Max.",
      price: 5.0,
      imagen:
        "https://m.media-amazon.com/images/I/714NpVwDTlL._AC_UF894,1000_QL80_.jpg",
      categoryId: categoriesMap["Camera Protectors"],
      investment: 3,
    },
    {
      name: "Cable tipo C a Lightning sin caja",
      description: "Cable tipo C a Lightning sin caja.",
      price: 8.0,
      imagen:
        "https://lh3.googleusercontent.com/proxy/9LZcW0ecukn3gm8GlGySzbzy18Mp3eAVX9gJ4oxlUiLBTJpL1xAu6XnxBrVVlz7Ka52oX--Y_KkSNgsnywUyys2GQg90oAdo6_rQL5MT2Kp8fB7_jaN7lVBMCv7XWcg",
      categoryId: categoriesMap["Cables"],
      investment: 5,
    },
    {
      name: "Cable tipo C a Lightning en caja",
      description: "Cable tipo C a Lightning con caja.",
      price: 10.0,
      imagen:
        "https://media1.apokin.es/115929/cable-tipo-c-a-lightning-1metro-blanco-caja-tipo-original.jpg",
      categoryId: categoriesMap["Cables"],
      investment: 6,
    },
    {
      name: "Cables micro o tipo C sueltos",
      description: "Cables micro USB o tipo C sin caja.",
      price: 4.0,
      imagen:
        "https://d22fxaf9t8d39k.cloudfront.net/c92667c662d239ad65eaf3d0378b5b07ca4b1c476353ec01ac71b50d6f56efd797753.jpg",
      categoryId: categoriesMap["Cables"],
      investment: 3,
    },
    {
      name: "Cables micro o tipo C en caja",
      description: "Cables micro USB o tipo C con caja.",
      price: 5.0,
      imagen:
        "https://ae01.alicdn.com/kf/H99c32299a9aa4b23beb75067acd76fdcZ.jpg?width=900&height=773&hash=1673",
      categoryId: categoriesMap["Cables"],
      investment: 3,
    },
    {
      name: "Cables iPhone sueltos",
      description: "Cables de iPhone sin caja.",
      price: 5.0,
      imagen:
        "https://dazimportadora.com.ar/wp-content/uploads/2024/03/Diseno-sin-titulo-51.png",
      categoryId: categoriesMap["Cables"],
      investment: 3,
    },
    {
      name: "Cables iPhone en caja",
      description: "Cables de iPhone con caja.",
      price: 7.0,
      imagen:
        "https://acdn.mitiendanube.com/stores/001/097/819/products/cable-iphone-caja-a7f78be730e2fc0b8817006694712704-1024-1024.jpg",
      categoryId: categoriesMap["Cables"],
      investment: 4,
    },
    {
      name: "Cables fly en bolsita",
      description: "Cables fly en bolsa.",
      price: 7.0,
      imagen: "https://weisys.com.ar/wp-content/uploads/2022/09/AC-78-1.jpg",
      categoryId: categoriesMap["Cables"],
      investment: 4,
    },
    {
      name: "Cable suelto tipo C a tipo C",
      description: "Cable tipo C a tipo C sin caja.",
      price: 7.0,
      imagen:
        "https://http2.mlstatic.com/D_NQ_NP_778942-MCO72365545120_102023-O.webp",
      categoryId: categoriesMap["Cables"],
      investment: 4,
    },
    {
      name: "Cable tipo C a tipo C en caja",
      description: "Cable tipo C a tipo C con caja.",
      price: 20.0,
      imagen:
        "https://media3.apokin.es/115930/cables-tipo-c-a-tipo-c-blanco-caja-tipo-original-1-metro.jpg",
      categoryId: categoriesMap["Cables"],
      investment: 13,
    },
    {
      name: "Powerbank de 20000mAh (marca variable)",
      description: "Powerbank de 20000mAh, precio según marca.",
      price: 40.0,
      imagen:
        "https://cdn.quicksell.co/-NnA3JRLuT2poAHeU_mi/products/-Ny21pXCceoeBJLvdkc7.jpg",
      categoryId: categoriesMap["Power Banks"],
      investment: 25,
    },
    {
      name: "Powerbank de 20000mAh (marca variable)",
      description: "Powerbank de 20000mAh, precio según marca.",
      price: 50.0,
      imagen:
        "https://cdn.quicksell.co/-NnA3JRLuT2poAHeU_mi/products/-Ny21pXCceoeBJLvdkc7.jpg",
      categoryId: categoriesMap["Power Banks"],
      investment: 31,
    },
    {
      name: "Powerbank de 20000mAh (marca variable)",
      description: "Powerbank de 20000mAh, precio según marca.",
      price: 60.0,
      imagen:
        "https://cdn.quicksell.co/-NnA3JRLuT2poAHeU_mi/products/-Ny21pXCceoeBJLvdkc7.jpg",
      categoryId: categoriesMap["Power Banks"],
      investment: 38,
    },
    {
      name: "Powerbank de 20000mAh (marca variable)",
      description: "Powerbank de 20000mAh, precio según marca.",
      price: 70.0,
      imagen:
        "https://cdn.quicksell.co/-NnA3JRLuT2poAHeU_mi/products/-Ny21pXCceoeBJLvdkc7.jpg",
      categoryId: categoriesMap["Power Banks"],
      investment: 44,
    },
    {
      name: "Powerbank de 10000mAh",
      description: "Powerbank de 10000mAh.",
      price: 30.0,
      imagen:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5oq6Tbjfr4YTJVb9-TjaREvdRXq7xuw9Z0A&s",
      categoryId: categoriesMap["Power Banks"],
      investment: 19,
    },
    {
      name: "Reloj Inteligente",
      description: "Smartwatch.",
      price: 50.0,
      imagen:
        "https://m.media-amazon.com/images/I/61Rq-ZkjnFL._AC_UF1000,1000_QL80_.jpg",
      categoryId: categoriesMap["Smart Watches"],
      investment: 31,
    },
    {
      name: "Reloj Inteligente",
      description: "Smartwatch.",
      price: 40.0,
      imagen:
        "https://m.media-amazon.com/images/I/61Rq-ZkjnFL._AC_UF1000,1000_QL80_.jpg",
      categoryId: categoriesMap["Smart Watches"],
      investment: 25,
    },
    {
      name: "Pilas AA y AAA (par)",
      description: "Pilas AA y AAA, precio por par.",
      price: 500.0,
      imagen:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5s-IAx_VlqY0nqlaODxPZSCKSeg0OIwRsDw&s",
      categoryId: categoriesMap["Batteries"],
      investment: 313,
    },
    {
      name: "Pilas Alkaline para linterna",
      description: "Pilas alcalinas para linterna.",
      price: 2000.0,
      imagen: "https://m.media-amazon.com/images/I/516kYw91A5L.jpg",
      categoryId: categoriesMap["Batteries"],
      investment: 1250,
    },
    {
      name: "OTG",
      description: "Adaptador OTG.",
      price: 4.0,
      imagen:
        "https://www.level1.com/media/catalog/product/cache/5dd1050e303ccd126a15d8279a1aa7f2/4/9/4985c387c192dd21b2f2cf2eb3775f18550768f3_133475_v1.jpg",
      categoryId: categoriesMap["Adapters"],
      investment: 3,
    },
    {
      name: "Teclado DK500",
      description: "Teclado modelo DK500.",
      price: 24.0,
      imagen:
        "https://tecnonissi.com/wp-content/uploads/2023/09/TN000046_2.webp",
      categoryId: categoriesMap["Keyboards"],
      investment: 15,
    },
    {
      name: "Extensión USB para laptop",
      description: "Extensión USB para laptop.",
      price: 15.0,
      imagen:
        "https://http2.mlstatic.com/D_Q_NP_963649-MPE75098451259_032024-O.webp",
      categoryId: categoriesMap["Cables"],
      investment: 9,
    },
    {
      name: "Manos libres inalámbricos negros",
      description: "Auriculares inalámbricos negros.",
      price: 15.0,
      imagen:
        "https://coregaming.com.mx/assets/uploads/sw_foto_3_22.jpg?1686797572",
      categoryId: categoriesMap["Wireless Earphones"],
      investment: 9,
    },
    {
      name: "Manos libres inalámbricos X10",
      description: "Auriculares inalámbricos modelo X10.",
      price: 20.0,
      imagen:
        "https://www.heavenimagenes.com/heavencommerce/68ac9d04-8767-4aca-9951-49f2fea1383b/images/v2/ALPINA%20MAYORISTA/23610_xlarge.jpg",
      categoryId: categoriesMap["Wireless Earphones"],
      investment: 13,
    },
    {
      name: "Inalámbricos Pure Bass, CZU, M59",
      description: "Auriculares inalámbricos Pure Bass, CZU, M59.",
      price: 30.0,
      imagen:
        "https://m.media-amazon.com/images/I/51EZig0rEAL._AC_UF894,1000_QL80_.jpg",
      categoryId: categoriesMap["Wireless Earphones"],
      investment: 19,
    },
    {
      name: "Inalámbrico 1 Hora",
      description: "Auriculares inalámbricos con 1 hora de carga.",
      price: 24.0,
      imagen:
        "https://m.media-amazon.com/images/I/61N2P7kZu8L._AC_UF1000,1000_QL80_.jpg",
      categoryId: categoriesMap["Wireless Earphones"],
      investment: 15,
    },
    {
      name: "Inalámbricos JBL",
      description: "Auriculares inalámbricos JBL.",
      price: 30.0,
      imagen:
        "https://m.media-amazon.com/images/I/61TrbMmWyOL._AC_UF894,1000_QL80_.jpg",
      categoryId: categoriesMap["Wireless Earphones"],
      investment: 19,
    },
    {
      name: "Inalámbricos Probus",
      description: "Auriculares inalámbricos Probus.",
      price: 30.0,
      imagen:
        "https://i5.walmartimages.com/seo/Wireless-Bluetooth-Earphones-ProBuds-Bluetooth-5-0-Built-In-Mic_19986db0-2cad-4c40-83a2-706dd204abd5.8740d7b074c4f6d9dea8442d602dffb1.jpeg",
      categoryId: categoriesMap["Wireless Earphones"],
      investment: 19,
    },
    {
      name: "Manilla de reloj con mica",
      description: "Manilla de reloj con mica protectora.",
      price: 8.0,
      imagen: "https://ss637.liverpool.com.mx/xl/1141195197.jpg",
      categoryId: categoriesMap["Watch Accessories"],
      investment: 5,
    },
    {
      name: "Soporte de celular para el carro - calidad baja",
      description: "Soporte de celular para el carro de calidad baja.",
      price: 8.0,
      imagen: "https://m.media-amazon.com/images/I/71-p8EqVB2L.jpg",
      categoryId: categoriesMap["Phone Accessories"],
      investment: 5,
    },
    {
      name: "Soporte de celular para el carro - calidad media",
      description: "Soporte de celular para el carro de calidad media.",
      price: 15.0,
      imagen: "https://m.media-amazon.com/images/I/61a4h3vEyOL.jpg",
      categoryId: categoriesMap["Phone Accessories"],
      investment: 9,
    },
    {
      name: "Soporte de celular para el carro - calidad alta",
      description: "Soporte de celular para el carro de calidad alta.",
      price: 20.0,
      imagen: "https://m.media-amazon.com/images/I/61ClbmXUoQL.jpg",
      categoryId: categoriesMap["Phone Accessories"],
      investment: 13,
    },
    {
      name: "Manos libres inalámbricos orejón (gatico y Sony)",
      description: "Auriculares inalámbricos orejón modelos gatico y Sony.",
      price: 30.0,
      imagen:
        "https://m.media-amazon.com/images/I/61F8IVzFI3L._AC_UF894,1000_QL80_.jpg",
      categoryId: categoriesMap["Wireless Earphones"],
      investment: 19,
    },
    {
      name: "Audífonos orejón para PC",
      description: "Audífonos orejón para PC.",
      price: 30.0,
      imagen:
        "https://m.media-amazon.com/images/I/61efw8tGD6L._AC_UF894,1000_QL80_.jpg",
      categoryId: categoriesMap["Headphones"],
      investment: 19,
    },
    {
      name: "Orejones iPhone",
      description: "Audífonos orejón para iPhone.",
      price: 80.0,
      imagen: "",
      categoryId: categoriesMap["Headphones"],
      investment: 50,
    },
  ];

  // Insertar productos en la base de datos
  for (const productData of productsData) {
    await prisma.product.create({
      data: {
        name: productData.name,
        description: productData.description,
        investments: productData.investment,
        price: productData.price,
        categoryId: productData.categoryId,
        imagen: productData.imagen,
        inventoryCount: 25,
        sedeId: "c4a20b23-0ff1-4e9e-b378-627f56d75b38",
      },
    });
  }

  console.log("Categorías y productos guardados exitosamente.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
