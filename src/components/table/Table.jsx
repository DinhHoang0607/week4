import React from 'react'
import styles from './Table.module.css'
const Table = ({ title, price }) => {
  return (
    <tr>
      <td className={styles.tableData}>{title}</td>
      <td
        className={`${styles.tableData} ${styles.tableBorder}`}
      >
        {price}
      </td>
    </tr>
  )
}

export default Table
