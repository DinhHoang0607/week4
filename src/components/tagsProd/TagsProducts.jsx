import {
  Tag,
  Listbox,
  Combobox,
  Icon,
  TextContainer,
  Stack,
  Button,
} from '@shopify/polaris'
import React from 'react'
import { useCallback, useState, useMemo } from 'react'
import {
  SearchMinor,
  AddCodeMajor,
} from '@shopify/polaris-icons'

const TagsProducts = ({
  data,
  selectedOptions,
  setSelectedOptions,
}) => {
  const unSelected = useMemo(() => {
    if (data) {
      let arr = data.shop.productTags.edges.map(
        (node) => {
          return { label: node.node, value: node.node }
        }
      )
      return arr
    }
    return []
  }, [data])
  const [input, setInput] = useState('')
  const [options, setOptions] = useState(unSelected)
  const updateText = useCallback(
    (value) => {
      setInput(value)
      if (value === '') {
        setOptions(unSelected)
        return
      }

      const filterReg = new RegExp(value, 'i')
      const result = unSelected.filter((sel) =>
        sel.label.match(filterReg)
      )
      setOptions(result)
    },
    [unSelected]
  )

  const checkExistTag = (input) => {
    let count = 0
    for (let i = 0; i < options.length; i++) {
      if (options[i].value === input) {
        count++
      }
    }
    if (count > 0) return true
    else return false
  }
  const handleAddTags = () => {
    if (checkExistTag(input)) console.log('ok')
    else {
      setSelectedOptions([...selectedOptions, input])
      setOptions([
        ...options,
        { label: input, value: input },
      ])
    }
  }
  const updateSelection = useCallback(
    (sel) => {
      if (selectedOptions.includes(sel)) {
        setSelectedOptions(
          selectedOptions.filter((opt) => opt !== sel)
        )
      } else {
        setSelectedOptions([...selectedOptions, sel])
      }
      const findOptions = options.find((opt) => {
        return opt.value.match(sel)
      })
      updateText('')
    },
    [options, selectedOptions]
  )

  const removeTags = useCallback(
    (tag) => () => {
      const selecteds = [...selectedOptions]
      selecteds.splice(selecteds.indexOf(tag), 1)
      setSelectedOptions(selecteds)
    },
    [selectedOptions]
  )

  const tagsMarkup = selectedOptions.map((option) => (
    <Tag
      key={`option-${option}`}
      onRemove={removeTags(option)}
    >
      {option}
    </Tag>
  ))

  const optionsMarkup =
    options.length > 0
      ? options.map((opt) => {
          const { label, value } = opt
          return (
            <Listbox.Option
              key={`${value}`}
              value={value}
              selected={selectedOptions.includes(
                value
              )}
              accessibilityLabel={label}
            >
              {label}
            </Listbox.Option>
          )
        })
      : null

  return (
    <div>
      <Combobox
        allowMultiple
        activator={
          <Combobox.TextField
            prefix={<Icon source={SearchMinor} />}
            onChange={updateText}
            label="Search tags"
            labelHidden
            value={input}
            placeholder="Search tags"
          />
        }
      >
        <Button onClick={handleAddTags}>
          <Icon source={AddCodeMajor} color="base" />
          Add Tags
        </Button>

        {optionsMarkup ? (
          <Listbox onSelect={updateSelection}>
            {optionsMarkup}
          </Listbox>
        ) : null}
      </Combobox>
      <TextContainer>
        <Stack>{tagsMarkup}</Stack>
      </TextContainer>
    </div>
  )
}

export default TagsProducts
