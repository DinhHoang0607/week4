import {
  Icon,
  ResourceItem,
  Thumbnail,
} from '@shopify/polaris'
import React from 'react'
import { CircleCancelMajor } from '@shopify/polaris-icons'
import styles from './SpecificList.module.css'
const SpecificProduct = ({ item, removeItem }) => {
  const { name, img } = item
  const media = (
    <Thumbnail size="medium" source={img} />
  )
  return (
    <div className={styles.container}>
      <ResourceItem id={name} media={media}>
        <div className={styles.itemContainer}>
          {name}
          <button
            className={styles.btn}
            onClick={() => removeItem(name)}
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

export default SpecificProduct
