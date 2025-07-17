import { Select, SelectItem } from "@heroui/react";
import useCategory from "../../customHooks/useCategory";
import { toast } from "sonner";
import { FC } from "react";

interface Props {
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
}

const Selected: FC<Props> = ({ setSelectedCategory }) => {
  const { category, error } = useCategory();
  const handleCategoryChange = (
    value: React.ChangeEvent<HTMLSelectElement>
  ) => {
    category?.map(
      (item) => item.id === value.target.value && setSelectedCategory(item.name)
    );
  };
  return (
    <>
      <Select
        name="selected"
        isRequired
        className="max-w-xs"
        labelPlacement="outside"
        label="Categoría:"
        placeholder="Selecciona una categoría"
        onChange={handleCategoryChange}
      >
        {category &&
          category.map((item) => (
            <SelectItem key={item.id}>{item.name}</SelectItem>
          ))}
      </Select>
      {error && error.map((err) => toast.error(err))}
    </>
  );
};

export default Selected;
