import axios from "axios";
import { useEffect, useState } from "react";
import "./Form.scss";

interface Item {
  code: string;
  description: string;
  varieties: string[];
}

interface Option {
  code: string;
  description: string;
}

interface Variety {
  code: string;
  description: string;
  options: Option[];
}

interface SelectedOptions {
  [key: string]: string;
}

export const Form = () => {
  const [itemsData, setItemsData] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [varietiesData, setVarietiesData] = useState<Variety[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});

  useEffect(() => {
    axios.get<Item[]>("http://localhost:3000/items").then(({ data }) => {
      setItemsData(data);
    });
  }, []);

  useEffect(() => {
    axios.get<Variety[]>("http://localhost:3000/varieties").then(({ data }) => {
      setVarietiesData(data);
    });
  }, []);

  useEffect(() => {
    setSelectedOptions({});
  }, [selectedItem]);

  const handleSelectedOption = (varietyCode: string, optionCode: string) => {
    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [varietyCode]: optionCode,
    }));
  };

  const varieties =
    itemsData.find((item) => item.code === selectedItem)?.varieties.map((varietyCode) =>
        varietiesData.find((variety) => variety.code === varietyCode)
    ) || [];


  return (
    <>
      <form
        className="form__container"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <section className="form__items">
          <label className="form__label form__label--items">
            Atlasīt preci:
            <select
              className="form__select"
              name="selectedItem"
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
            >
              <option> </option>
              {itemsData.map((item) => {
                return (
                  <option key={item.code} value={item.code}>
                    {item.description}
                  </option>
                );
              })}
            </select>
          </label>
        </section>

        <section className="form__varieties">
          {varieties.map((variety) => {
            if (variety) {
              const { code, description, options } = variety;
              const selectedOption = selectedOptions[code] || "";

              return (
                <div key={code}>
                  <label className="form__label">
                    {description}:
                    <select
                      className="form__select"
                      name={description}
                      value={selectedOption}
                      onChange={(e) =>
                        handleSelectedOption(code, e.target.value)
                      }
                    >
                      <option> </option>
                      {options.map((option) => (
                        <option key={option.code} value={option.code}>
                          {option.description}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              );
            }
            return null;
          })}
        </section>
      </form>

      <section className="selected-item">
        <span>Tava izvēlētā prece: </span>
        <div className="selected-item__code">
          <div>{selectedItem}</div>
          {Object.values(selectedOptions).length > 0 && <div>.</div>}
          {Object.values(selectedOptions).join(".")}
        </div>
      </section>
    </>
  );
};
