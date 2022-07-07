import {
  Card,
  Page,
  Layout,
  Stack,
  Select,
  RadioButton,
  TextField,
  FormLayout,
  Form,
  Frame,
  Toast,
  InlineError,
  Banner,
  Spinner,
} from '@shopify/polaris'
import { useState, useCallback } from 'react'
import { ResourcePicker } from '@shopify/app-bridge-react'
import styles from './Homepage.module.css'
import SpecificList from './specificProd/SpecificList'
import {
  useQuery,
  gql,
  useLazyQuery,
} from '@apollo/client'
import CollectionsList from './collectionsProd/CollectionsList'
import TagsProducts from './tagsProd/TagsProducts'
import FullTable from './table/FullTable'

const getCurrency = gql`
  query {
    shop {
      currencyCode
    }
  }
`
const getAllProducts = gql`
  query {
    products(first: 15) {
      edges {
        node {
          title
          totalVariants
          priceRangeV2 {
            minVariantPrice {
              amount
            }
          }
        }
      }
    }
  }
`

const getAllTags = gql`
  query {
    shop {
      productTags(first: 100) {
        edges {
          node
        }
      }
    }
  }
`

const getProductsByIds = gql`
  query getProducts($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        title
        totalVariants
        priceRangeV2 {
          minVariantPrice {
            amount
          }
        }
      }
    }
  }
`
const getProductsByCollections = gql`
  query ($query: String!) {
    collections(first: 5, query: $query) {
      edges {
        node {
          products(first: 15) {
            edges {
              node {
                title
                id
                totalVariants
                priceRangeV2 {
                  minVariantPrice {
                    amount
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

const getProductsByTags = gql`
  query ($query: String!) {
    products(first: 15, query: $query) {
      nodes {
        title
        tags
        totalVariants
        priceRangeV2 {
          minVariantPrice {
            amount
          }
        }
      }
    }
  }
`

export function HomePage() {
  const { loading, error, data } = useQuery(getAllTags)
  const { data: currency } = useQuery(getCurrency)
  // console.log(currency.shop.currencyCode)
  if (error) {
    return <Banner status="critical">Errors</Banner>
  }

  const [messageToast, setMessageToast] = useState('')
  const setmessToast = useCallback(
    (string) => setMessageToast(string),
    []
  )
  //product
  const [productsOpen, setProductsOpen] =
    useState(false)
  const [specificProducts, setSpecificProducts] =
    useState({})
  const handleProductsSelection = (resources) => {
    setProductsOpen(false)
    setSpecificProducts(resources)
  }
  const removeProductItem = useCallback(
    (name) => {
      setSpecificProducts({
        ...specificProducts,
        selection: specificProducts.selection.filter(
          (item) => {
            return item.title !== name
          }
        ),
      })
    },
    [specificProducts]
  )

  const [collectionsOpen, setCollectionsOpen] =
    useState(false)
  const [collections, setCollections] = useState({})
  const handleCollectionsSelection = (resources) => {
    setCollectionsOpen(false)
    setCollections(resources)
  }
  const removeCollectionsItem = useCallback(
    (name) => {
      setCollections({
        ...collections,
        selection: collections.selection.filter(
          (item) => {
            return item.title !== name
          }
        ),
      })
    },
    [collections]
  )

  const [selectedOptions, setSelectedOptions] =
    useState([])

  const [name, setName] = useState('')
  const [errorName, setErrorName] = useState(false)
  const [errNameRegex, setErrNameRegex] =
    useState(true)
  const handleChangeName = useCallback((value) => {
    setName(value)
    handleChangeErrorName(value)
  })
  const handleChangeErrorName = (value) => {
    if (/([a-zA-Z]+)$/.test(value)) {
      setErrNameRegex(true)
      // return true
    } else if (!/([a-zA-Z]+)$/.test(value)) {
      setErrNameRegex(false)
      // return false
    }
    if (!value) {
      setErrorName(true)
      return false
    } else if (value) {
      setErrorName(false)
      return true
    }
  }
  const [priority, setPriority] = useState()
  const [priorityError, setPriorityError] =
    useState('')
  function handlePriorityChangeError(value) {
    setPriorityError('')
    if (!/^[0-9]+$/.test(value)) {
      setPriorityError(
        'Value can only be an integer and is required'
      )
      return false
    } else if (parseInt(value) > 99) {
      setPriorityError(
        'Maximum value of priority is 99'
      )
      return false
    }
    return true
  }
  const handlePriorityChange = useCallback(
    (value) => {
      handlePriorityChangeError(value)
      setPriority(value)
    },
    [priority]
  )

  const options = [
    { label: 'Enable', value: 'enable' },
    { label: 'Disable', value: 'disable' },
  ]
  const [selected, setSelected] = useState('enable')
  const handleChangeSelected = useCallback((value) => {
    setSelected(value)
  }, [])

  //productRadio
  const [productRadioValue, setProductRadioValue] =
    useState('allProducts')
  const handleChangeRadio = useCallback(
    (_checked, newValue) => {
      setTable(false)
      return setProductRadioValue(newValue)
    },
    []
  )

  //customprice
  const [priceValue, setPriceValue] =
    useState('constPrice')
  const [priceError, setPriceError] = useState('')
  const [constPrice, setConstPrice] = useState('')
  const [fixedPrice, setFixedPrice] = useState('')
  const [percentPrice, setPercentPrice] = useState('')
  const handleChangePrice = useCallback(
    (_checked, newValue) => {
      setPriceError('')
      // if (newValue !== 'constPrice') setConstPrice()
      // if (newValue !== 'fixedPrice') setFixedPrice()
      // if (newValue !== 'percentPrice')
      //   setPercentPrice()
      return setPriceValue(newValue)
    }
  )
  const handleConstPriceError = (value) => {
    if (
      !/^(0*[1-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*)$/.test(
        value
      )
    ) {
      setPriceError(
        'Price must be a number and greater than 0'
      )
      return false
    } else {
      setPriceError('')
      return true
    }
  }
  const handleConstPrice = (value) => {
    handleConstPriceError(value)
    setConstPrice(value)
  }
  const handleFixedPriceError = (value) => {
    if (
      !/^(0*[1-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*)$/.test(
        value
      )
    ) {
      setPriceError(
        'Price must be a number and greater than 0'
      )
      return false
    } else {
      setPriceError('')
      return true
    }
  }
  const handleFixedPrice = (value) => {
    handleFixedPriceError(value)
    setFixedPrice(value)
    // console.log(fixedPrice)
  }
  const handlePercentPriceError = (value) => {
    if (
      !/^(0*[1-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*)$/.test(
        value
      )
    ) {
      setPriceError(
        'Price must be number greater than 0'
      )
      return false
    } else if (parseFloat(value) > 100) {
      setPriceError(
        "Value can't greater than 100, please select again"
      )
      return false
    } else {
      setPriceError('')
      return true
    }
  }
  const handlePercentPrice = (value) => {
    handlePercentPriceError(value)
    setPercentPrice(value)
  }

  const [table, setTable] = useState([])
  const [loadingTable, setLoadingTable] =
    useState(false)

  const formatCurrency = (currency) => {
    if (currency === 'VND') return ' ₫'
    else if (currency === 'USD') return ' $'
    else if (currency === 'JPY') return ' ¥'
    else if (currency === 'KRW') return ' ₩'
  }

  const formatPrice = (price) => {
    if (priceValue === 'fixedPrice') {
      let newPrice = price - parseFloat(fixedPrice)
      if (newPrice < 0) {
        setmessToast(
          `This price is greater than some price of products, so they will have 0 ${formatCurrency(
            currency.shop.currencyCode
          )}`
        )
        return (
          0 +
          formatCurrency(currency.shop.currencyCode)
        )
      }
      return (
        newPrice +
        formatCurrency(currency.shop.currencyCode)
      )
    } else if (priceValue === 'constPrice') {
      if (price <= parseFloat(constPrice)) {
        setmessToast(
          'This price is greater than some product, so return default price'
        )
        return (
          price +
          formatCurrency(currency.shop.currencyCode)
        )
      } else {
        return (
          parseFloat(constPrice) +
          formatCurrency(currency.shop.currencyCode)
        )
      }
    } else if (priceValue === 'percentPrice') {
      let newPrice =
        price * (1 - parseFloat(percentPrice) / 100)
      return (
        newPrice.toFixed(2) +
        formatCurrency(currency.shop.currencyCode)
      )
    }
  }

  //get data
  const [
    getDataAllProducts,
    {
      called: allProductsCalled,
      refetch: allProductsRefetch,
      loading: allProductsLoading,
      error: allProductsError,
      data: allProductsData,
    },
  ] = useLazyQuery(getAllProducts, {
    fetchPolicy: 'network-only',
    notifiOnNetworkStatusChange: true,
    onCompleted: (data) => {
      let Arr = data.products.edges.map((prod) => {
        let title = prod.node.title
        let price = formatPrice(
          parseFloat(
            prod.node.priceRangeV2.minVariantPrice
              .amount
          )
        )
        // console.log(title, price)
        return { title, price }
      })
      setTable(Arr)
      setLoadingTable(false)
    },
  })

  const [
    getAllProductsByIds,
    {
      called: ProductByIdsCalled,
      refetch: ProductByIdsRefetch,
      loading: ProductByIdsLoading,
      error: ProductByIdsError,
      data: ProductByIdsData,
    },
  ] = useLazyQuery(getProductsByIds, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      let Arr = data.nodes.map((product) => {
        let title = product.title
        let price = formatPrice(
          parseFloat(
            product.priceRangeV2.minVariantPrice.amount
          )
        )
        return { title, price }
      })
      setTable(Arr)
      setLoadingTable(false)
    },
  })

  const [
    getAllProductsByCollections,
    {
      called: ProductByCollectionsCalled,
      refetch: ProductByCollectionsRefetch,
      loading: ProductByCollectionsLoading,
      error: ProductByCollectionsError,
      data: ProductByCollectionsData,
    },
  ] = useLazyQuery(getProductsByCollections, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      let dataArray = data.collections.edges.map(
        (collec) => {
          return collec.node.products.edges.map(
            (edge) => {
              let title = edge.node.title
              let price = formatPrice(
                parseFloat(
                  edge.node.priceRangeV2
                    .minVariantPrice.amount
                )
              )
              return { title, price }
            }
          )
        }
      )
      let titles = {}
      let arrTmps = []
      for (let i = 0; i < dataArray.length; i++) {
        for (let j = 0; j < dataArray[i].length; j++) {
          if (!titles[dataArray[i][j].title]) {
            arrTmps.push(dataArray[i][j])
          }
          titles[dataArray[i][j].title] = 1
        }
      }
      if (arrTmps.length > 0) setTable(arrTmps)
      else {
        setmessToast('No products in this collections')
      }
      setLoadingTable(false)
    },
  })

  const [
    getAllProductsByTags,
    {
      called: ProductByTagCalled,
      refetch: ProductByTagRefetch,
      loading: ProductByTagLoading,
      error: ProductByTagError,
      data: ProductByTagData,
    },
  ] = useLazyQuery(getProductsByTags, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      if (data.products.nodes.length === 0) {
        setmessToast(
          "There aren't any products in these tags"
        )
        return
      }
      let dataArray = data.products.nodes.map(
        (product) => {
          let title = product.title
          let price = formatPrice(
            parseFloat(
              product.priceRangeV2.minVariantPrice
                .amount
            )
          )
          return { title, price }
        }
      )
      setTable(dataArray)
      setLoadingTable(false)
    },
  })

  if (
    allProductsError ||
    ProductByIdsError ||
    ProductByCollectionsError ||
    ProductByTagError
  ) {
    setmessToast(
      'There are some errors in fetching data'
    )
  }

  function createQuery(array, param) {
    let query = ''
    for (let i = 0; i < array.length; i++) {
      if (i === 0) {
        query += `${param}:'${array[i]}' `
        continue
      }
      query += `OR ${param}:'${array[i]}' `
    }
    query = query.trim()
    return query
  }

  const handleShowFinalPrice = async (e) => {
    let err = []
    err.push(handleChangeErrorName(name))
    err.push(errNameRegex)
    err.push(handlePriorityChangeError(priority))
    if (priceValue === 'constPrice')
      err.push(handleConstPriceError(constPrice))
    else if (priceValue === 'fixedPrice')
      err.push(handleFixedPriceError(fixedPrice))
    else if (priceValue === 'percentPrice')
      err.push(handlePercentPriceError(percentPrice))
    let Errors = err.some((val) => {
      return val === false
    })
    if (Errors) setmessToast('You have some Error')
    else {
      if (productRadioValue === 'allProducts') {
        getDataAllProducts()
        setLoadingTable(true)
      } else if (
        productRadioValue === 'specificProducts'
      ) {
        if (
          !specificProducts.selection ||
          specificProducts.selection.length === 0
        ) {
          setmessToast('You must choose some products')
        } else {
          let ids = specificProducts.selection.map(
            (prod) => prod.id
          )
          getAllProductsByIds({
            variables: {
              ids: ids,
            },
          })
          setLoadingTable(true)
        }
      } else if (productRadioValue === 'collections') {
        if (
          !collections.selection ||
          collections.selection.length === 0
        ) {
          setmessToast(
            'You must choose some collections'
          )
        } else {
          let titleArr = collections.selection.map(
            (collec) => {
              return collec.title
            }
          )

          let query = createQuery(titleArr, 'title')
          getAllProductsByCollections({
            variables: {
              query,
            },
          })
          setLoadingTable(true)
        }
      } else if (productRadioValue === 'tags') {
        if (selectedOptions.length === 0)
          setmessToast('You must choose some tags')
        else {
          let query = createQuery(
            selectedOptions,
            'tags'
          )
          getAllProductsByTags({
            variables: {
              query,
            },
          })
          setLoadingTable(true)
        }
      }
    }
  }

  //====================================================

  return (
    <Frame>
      {messageToast && (
        <Toast
          content={messageToast}
          onDismiss={() => {
            setmessToast('')
          }}
          duration={6700}
        />
      )}
      <Page fullWidth={true}>
        <ResourcePicker
          resourceType="Product"
          showVariants={false}
          open={productsOpen}
          initialSelectionIds={
            specificProducts.selection
          }
          onSelection={(resources) =>
            handleProductsSelection(resources)
          }
          onCancel={() => {
            if (!specificProducts.selection) {
              setmessToast('Select products please')
            }
            setProductsOpen(false)
          }}
        />
        <ResourcePicker
          resourceType="Collection"
          showVariants={true}
          open={collectionsOpen}
          initialSelectionIds={collections.selection}
          onSelection={(resources) =>
            handleCollectionsSelection(resources)
          }
          onCancel={() => setCollectionsOpen(false)}
        />
        <Layout>
          <Layout.Section>
            <h1 className={styles.title}>
              New Pricing Rules
            </h1>
            <Card
              title="General Information"
              sectioned
            >
              <Form>
                <FormLayout>
                  <TextField
                    value={name}
                    onChange={handleChangeName}
                    label="Name"
                    type="text"
                    autoComplete="off"
                    id="name"
                  />
                  {errorName && (
                    <InlineError
                      message="Name is required"
                      fieldID="name"
                    />
                  )}
                  {!errNameRegex && !errorName && (
                    <InlineError
                      message="Name is not suitable!"
                      fieldID="name"
                    />
                  )}
                  <TextField
                    max={99}
                    min={0}
                    type="number"
                    label="Priority"
                    autoComplete="off"
                    value={priority}
                    onChange={handlePriorityChange}
                    id="priority"
                    helpText={
                      <span>
                        Please enter an integer from 0
                        to 99. 0 is the highest
                        priority.
                      </span>
                    }
                  />
                  {priorityError && (
                    <InlineError
                      message={priorityError}
                      fieldID="priority"
                    />
                  )}
                  <Select
                    label="Status"
                    options={options}
                    onChange={handleChangeSelected}
                    value={selected}
                  />
                </FormLayout>
              </Form>
            </Card>
            <Card title="Apply to product" sectioned>
              <Stack vertical>
                <RadioButton
                  label="All products"
                  id="allProducts"
                  checked={
                    productRadioValue === 'allProducts'
                  }
                  onChange={handleChangeRadio}
                />
                <RadioButton
                  label="Specific products"
                  id="specificProducts"
                  checked={
                    productRadioValue ===
                    'specificProducts'
                  }
                  onChange={handleChangeRadio}
                />
                {productRadioValue ===
                  'specificProducts' && (
                  <>
                    <TextField
                      onFocus={(e) => {
                        setProductsOpen(true)
                      }}
                      placeholder="Search Products"
                      autoComplete="off"
                    />
                    <SpecificList
                      data={specificProducts}
                      removeItem={removeProductItem}
                    />
                  </>
                )}
                <RadioButton
                  label="Product Collections"
                  id="collections"
                  checked={
                    productRadioValue === 'collections'
                  }
                  onChange={handleChangeRadio}
                />
                {productRadioValue ===
                  'collections' && (
                  <>
                    <TextField
                      onFocus={(e) => {
                        setCollectionsOpen(true)
                      }}
                      placeholder="Search Collections"
                      autoComplete="off"
                    />
                    <CollectionsList
                      data={collections}
                      removeItem={
                        removeCollectionsItem
                      }
                    />
                  </>
                )}
                <RadioButton
                  label="Product Tags"
                  id="tags"
                  checked={
                    productRadioValue === 'tags'
                  }
                  onChange={handleChangeRadio}
                />
                {data && productRadioValue === 'tags' && (
                  <>
                    <TagsProducts
                      data={data}
                      setSelectedOptions={
                        setSelectedOptions
                      }
                      selectedOptions={selectedOptions}
                    />
                  </>
                )}
              </Stack>
            </Card>
            <Card title="Custom Prices" sectioned>
              <Stack vertical>
                <RadioButton
                  label="Apply a price to selected products"
                  id="constPrice"
                  checked={priceValue === 'constPrice'}
                  onChange={handleChangePrice}
                />
                <RadioButton
                  label="Decrease a fixed amount of the original price of the selected products"
                  id="fixedPrice"
                  checked={priceValue === 'fixedPrice'}
                  onChange={handleChangePrice}
                />
                <RadioButton
                  label="Decrease the original prices of selected products by a percentage (%)"
                  id="percentPrice"
                  checked={
                    priceValue === 'percentPrice'
                  }
                  onChange={handleChangePrice}
                />
              </Stack>
              <span style={{ margin: '20px' }}>
                {priceValue === 'constPrice' && (
                  <TextField
                    min={0}
                    type="number"
                    autoComplete="off"
                    value={constPrice}
                    label="Amount"
                    helpText={
                      <span>number greater 0</span>
                    }
                    id="priceAmount1"
                    onChange={handleConstPrice}
                  />
                )}
                {priceValue === 'fixedPrice' && (
                  <TextField
                    min={0}
                    type="number"
                    autoComplete="off"
                    value={fixedPrice}
                    label="Amount"
                    helpText={
                      <span>number greater 0</span>
                    }
                    id="priceAmount2"
                    onChange={handleFixedPrice}
                  />
                )}
                {priceValue === 'percentPrice' && (
                  <TextField
                    min={0}
                    max={100}
                    type="number"
                    autoComplete="off"
                    value={percentPrice}
                    label="Amount"
                    helpText={
                      <span>
                        number greater 0 and smaller
                        100
                      </span>
                    }
                    id="priceAmount3"
                    onChange={handlePercentPrice}
                  />
                )}
                {priceError && (
                  <InlineError
                    message={priceError}
                    fieldID="priceError"
                  />
                )}
              </span>
            </Card>
          </Layout.Section>
          <Layout.Section secondary>
            <div className={styles.secondContainer}>
              <button
                className={styles.secondBtn}
                onClick={handleShowFinalPrice}
              >
                show
              </button>
              {table.length > 0 ? (
                !loadingTable ? (
                  <FullTable data={table} />
                ) : (
                  <Spinner />
                )
              ) : (
                loadingTable && <Spinner />
              )}
            </div>
          </Layout.Section>
        </Layout>
      </Page>
    </Frame>
  )
}
