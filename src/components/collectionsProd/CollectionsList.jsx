import React, { useMemo } from 'react'
import CollectionsProduct from './CollectionsProduct'
import { ResourceList } from '@shopify/polaris'
const CollectionsList = ({ data, removeItem }) => {
  const dataCollections = useMemo(() => {
    if (data) {
      if (data.selection) {
        return data.selection.map((product) => {
          let img = ''
          if (product.image) {
            img = product.image
          }
          return { name: product.title, img: img }
        })
      }
    }
    return []
  }, [data])

  return (
    <ResourceList
      resourceName={{
        singular: 'collection',
        plural: 'collections',
      }}
      items={dataCollections}
      renderItem={(item) => {
        return (
          <CollectionsProduct
            item={item}
            removeItem={removeItem}
          />
        )
      }}
    />
  )
}

export default CollectionsList
