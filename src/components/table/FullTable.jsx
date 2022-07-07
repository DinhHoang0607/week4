import React from 'react'
import Table from './Table'
import styles from './Table.module.css'

const FullTable = ({ data }) => {
  return (
    <table className={styles.container}>
      <thead className={styles.tableSection}>
        <tr>
          <th className={styles.tableHeader}>Title</th>
          <th
            className={`${styles.tableData} ${styles.tableBorder}`}
          >
            Final Price
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((value, index) => {
          return (
            <Table
              key={index}
              title={value.title}
              price={value.price}
            />
          )
        })}
      </tbody>
    </table>
  )
}

export default FullTable
