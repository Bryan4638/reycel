import {
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  ScrollShadow,
  Slider,
} from "@heroui/react";
import { Category, SortOption } from "../../types";
import { FC, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { TbReload } from "react-icons/tb";
import { useFilterStore } from "../../store/useFilterStore";
import Star from "../Details/Star";

interface FiltersProps {
  categories: Category[];
  isOpen: boolean;
  toggle: () => void;
}

const Filters: FC<FiltersProps> = ({ categories, isOpen, toggle }) => {
  const [rating, setRating] = useState(0);
  const [selectCategories, setSelectCategories] = useState<string[]>([]);
  const [rangePrice, setRangePrice] = useState<number[]>([]);
  const [selectedValue, setSelectedValue] = useState<string>();

  const { sortParmas, setSortParmas, setFilters } = useFilterStore();

  const debounced = useDebouncedCallback((value: number[]) => {
    setRangePrice(value);
  }, 800);

  useEffect(() => {
    setFilters({
      rating: rating,
      category: selectCategories,
      minPrice: rangePrice[0],
      maxPrice: rangePrice[1],
    });
  }, [rating, rangePrice, selectCategories, setFilters]); //revisar dependencias

  const handleReset = () => {
    setSelectedValue("");
    setRating(0);
    setSortParmas([]);
    setFilters({});
  };

  const handleSortChange = async (key: string) => {
    let newSortOptions: Array<SortOption> = [];
    setSelectedValue(key);
    switch (key) {
      case "masViejo":
        newSortOptions = [{ field: "createdAt", order: "asc" }];
        break;
      case "masNuevo":
        newSortOptions = [{ field: "createdAt", order: "desc" }];
        break;
      case "precioCreciente":
        newSortOptions = [
          { field: "price", order: "asc" },
          { field: "createdAt", order: "asc" },
        ];
        break;
      case "precioDecreciente":
        newSortOptions = [
          { field: "price", order: "desc" },
          { field: "createdAt", order: "asc" },
        ];
        break;
      case "masPopular":
        newSortOptions = [
          { field: "ratingAverage", order: "desc" },
          { field: "createdAt", order: "asc" },
        ];
        break;
      case "menosPopular":
        newSortOptions = [
          { field: "ratingAverage", order: "asc" },
          { field: "createdAt", order: "asc" },
        ];
        break;
      default:
        break;
    }
    setSortParmas(newSortOptions);
  };

  return (
    <>
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity"
          onClick={toggle}
          aria-hidden="true"
        />
      )}
      <aside
        className={`
        fixed top-10 left-0 h-full w-64 bg-white shadow-lg z-20
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:z-10
      `}
      >
        <div className="h-full py-3 bg-slate-100 w-64 px-3 fixed">
          <ScrollShadow hideScrollBar size={1} className="h-screen pb-16">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h6 className="text-base font-semibold text-neutral-500 dark:text-white">
                  Filtros
                </h6>
                {sortParmas.length !== 0 && (
                  <button
                    onClick={handleReset}
                    className="size-6 rounded-md bg-slate-200 hover:bg-slate-300 transition flex items-center justify-center text-neutral-800"
                  >
                    <TbReload />
                  </button>
                )}
              </div>
              <RadioGroup
                size="sm"
                onValueChange={handleSortChange}
                value={selectedValue}
              >
                <Radio value="masPopular">Más Popular</Radio>
                <Radio value="menosPopular">Menos Popular</Radio>
                <Radio value="precioCreciente">Precio Creciente</Radio>
                <Radio value="precioDecreciente">Precio Decreciente</Radio>
                <Radio value="masNuevo">Más Nuevo</Radio>
                <Radio value="masViejo">Más Viejo</Radio>
              </RadioGroup>

              <Slider
                className="max-w-md px-1 pt-3"
                defaultValue={[0, 100000]}
                onChange={(value) => debounced(value as number[])}
                formatOptions={{ style: "currency", currency: "USD" }}
                label={
                  <h6 className="mb-2 text-base font-medium text-neutral-500 dark:text-white">
                    Precio
                  </h6>
                }
                maxValue={100000}
                minValue={0}
                step={500}
              />

              <div className="grid grid-cols-2 gap-5 pt-3">
                <div className="w-full">
                  <h6 className="mb-2 text-base font-medium text-neutral-500 dark:text-white">
                    Rating
                  </h6>
                  <Star value={rating} onChange={setRating} ratingString={false}/>
                </div>
              </div>

              <CheckboxGroup
                className="pt-3"
                color="primary"
                size="sm"
                label="Categorías"
                onValueChange={setSelectCategories}
              >
                {categories.map((categori) => (
                  <Checkbox key={categori.id} value={categori.id}>
                    {categori.name}
                  </Checkbox>
                ))}
              </CheckboxGroup>
            </div>
          </ScrollShadow>
        </div>
      </aside>
    </>
  );
};

export default Filters;
