import { removeLineItem } from '@shopify/app-bridge/actions/Cart'
import {
  ResourceItem,
  Thumbnail,Icon
} from '@shopify/polaris'
import React from 'react'
import styles from './CollectionsList.module.css'
import { CircleCancelMajor } from '@shopify/polaris-icons'

const CollectionsProduct = ({ item, removeItem }) => {
  const { name, img } = item
  const media = (
    <Thumbnail source={img} size="medium" />
  )
  return (
    <div className={styles.container}>
      <ResourceItem id={name} media={media}>
        <div className={styles.itemContainer}>
          {name}
          <button
            className={styles.btn}
            onClick={() => {
              removeItem(name)
            }}
          >
            <Icon
              source={CircleCancelMajor}
              color="base"
            />
          </button>
        </div>
      </ResourceItem>
    </div>
  )
}

export default CollectionsProduct
