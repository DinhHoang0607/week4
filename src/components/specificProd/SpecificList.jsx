import { ResourceList } from '@shopify/polaris'
import React from 'react'
import { useMemo } from 'react'
import SpecificProduct from './SpecificProduct'

const SpecificList = ({ data, removeItem }) => {
  const dataSpecific = useMemo(() => {
    if (data) {
      if (data.selection) {
        console.log(data.selection)
        return data.selection.map((product) => {
          let img = ''
          if (product.images.length > 0)
            img = product.images[0].originalSrc
          return { name: product.title, img: img }
        })
      }
    }
    return []
  }, [data])
  return (
    <ResourceList
      resourceName={{
        singular: 'product',
        plural: 'products',
      }}
      items={dataSpecific}
      renderItem={(item) => {
        return (
          <SpecificProduct
            item={item}
            removeItem={removeItem}
          />
        )
      }}
    />
  )
}

export default SpecificList
