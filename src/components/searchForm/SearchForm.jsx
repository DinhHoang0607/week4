import {
  Autocomplete,
  Icon,
  IndexTable,
  TextStyle,
  Card,
  Form,
    FormLayout,
    Page,
  Button,
  useIndexResourceState,
} from "@shopify/polaris";
import data from "./data.json";
import { SearchMinor,CircleCancelMajor } from "@shopify/polaris-icons";
import { useState, useCallback } from "react";

const SearchForm = () => {
  const [url, setUrl] = useState("");

  const handleSubmit = useCallback((_event) => setUrl(""), []);

  const handleUrlChange = useCallback((value) => setUrl(value), []);
  const deselectedOptions = [
    { value: "rustic", label: "Rustic" },
    { value: "antique", label: "Antique" },
    { value: "vinyl", label: "Vinyl" },
    { value: "vintage", label: "Vintage" },
    { value: "refurbished", label: "Refurbished" },
  ];
  //   console.log(customers);
  const customers = data;
  const resourceName = {
    singular: "customer",
    plural: "customers",
  };

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState(deselectedOptions);
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(customers);

  const updateText = useCallback(
    (value) => {
      setInputValue(value);

      if (value === "") {
        setOptions(deselectedOptions);
        return;
      }

      const filterRegex = new RegExp(value, "i");
      const resultOptions = deselectedOptions.filter((option) =>
        option.label.match(filterRegex)
      );
      setOptions(resultOptions);
    },
    [deselectedOptions]
  );

  const updateSelection = useCallback(
    (selected) => {
      const selectedValue = selected.map((selectedItem) => {
        const matchedOption = options.find((option) => {
          return option.value.match(selectedItem);
        });
        return matchedOption && matchedOption.label;
      });

      setSelectedOptions(selected);
      setInputValue(selectedValue[0]);
    },
    [options]
  );
  const promotedBulkActions = [
    {
      content: "Edit customers",
      onAction: () => console.log("Todo: implement bulk edit"),
    },
  ];
  const bulkActions = [
    {
      content: "Add tags",
      onAction: () => console.log("Todo: implement bulk add tags"),
    },
    {
      content: "Remove tags",
      onAction: () => console.log("Todo: implement bulk remove tags"),
    },
    {
      content: "Delete customers",
      onAction: () => console.log("Todo: implement bulk delete"),
    },
  ];
  const textField = (
    <Autocomplete.TextField
      onChange={updateText}
      value={inputValue}
      prefix={<Icon source={SearchMinor} color="base" />}
      placeholder="Search"
    />
  );

  const rowMarkup = customers.map(({ id, img, name }, index) => (
    <IndexTable.Row
      id={id}
      key={id}
      selected={selectedResources.includes(id)}
      position={index}
    >
      <IndexTable.Cell>
        <img src={img} alt="logo" style={{ width: "50px", height: "50px" }} />
      </IndexTable.Cell>
      <IndexTable.Cell>
        <TextStyle variation="strong">{name}</TextStyle>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <Page fullWidth title="Custom Prices" secondaryActions={[{content:" ",icon:CircleCancelMajor}]}>
      <Autocomplete
        options={options}
        selected={selectedOptions}
        onSelect={updateSelection}
        textField={textField}
      />
      <Form noValidate onSubmit={handleSubmit}>
        <FormLayout>
          <IndexTable
            resourceName={resourceName}
            itemCount={customers.length}
            selectedItemsCount={
              allResourcesSelected ? "All" : selectedResources.length
            }
            onSelectionChange={handleSelectionChange}
            bulkActions={bulkActions}
            promotedBulkActions={promotedBulkActions}
            headings={[{ title: "" }, { title: "" }]}
          >
            {rowMarkup}
          </IndexTable>
          <Button submit>Submit</Button>
        </FormLayout>
      </Form>
    </Page>
  );
};

export default SearchForm;
