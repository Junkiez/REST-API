<template>
  <h1>Rest-Api Client</h1>
  <div class="form" v-if="addForm">
    <label for="productName">Name: </label>
    <input type="text" id="productName" v-model="productName"/><br/>
    <label for="maxOnPage">Price: </label>
    <input type="number" id="productPrice" v-model="productPrice"/><br/>
    <button type="button" @click="addProduct()">+</button>
    <button type="button" @click="addForm=false">x</button>
  </div>
  <table>
    <caption>
      <label for="sortType">sorting: </label>
      <select id="sortType" v-model="sort">
        <option value="asc">ASC</option>
        <option value="desc">DESC</option>
      </select>
      <label for="sortBy">sort by: </label>
      <select id="sortBy" v-model="sortField">
        <option value="price">Price</option>
        <option value="name">Name</option>
      </select>
    </caption>
    <tr class="counter">Count {{ countAll }}</tr>
    <tr>
      <th>Id</th>
      <th>Name</th>
      <th>Price</th>
      <th></th>
    </tr>
    <tr class="data-row" v-for="e in products" :key="e.id">
      <td>{{ e.id }}</td>
      <td>{{ e.name }}</td>
      <td>{{ e.price }}</td>
      <td>
        <button type="button" @click="deleteProduct(e.id)">Del</button>
      </td>
    </tr>
    <tr>
      <th>
        <button type="button" @click="pageIndex -= pageIndex>1 ? 1 : 0 ">&#60;</button>
      </th>
      <th>page {{ pageIndex }}</th>
      <th>
        <button type="button" @click="pageIndex += products.length == pageSize ? 1 : 0 ">&#62;</button>
      </th>
    </tr>
  </table>
  <label for="maxOnPage">on page: </label>
  <input type="number" id="maxOnPage" v-model="pageSize"/><br/>
  <div class="card">
    <button type="button" @click="getMinPriceProduct()">Get min</button>
    <button type="button" @click="getMaxPriceProduct()">Get max</button>
    <button type="button" @click="getMedianPriceProduct()">Get median</button>
    <button type="button" @click="getProductById()">Get by id</button>
    <button type="button" @click="addForm = true">Add</button>
    <button type="button" @click="deleteProduct()">Delete all</button>
  </div>
</template>
<script>
export default {
  name: "App",
  mounted: async function () {
    await this.getProducts();
  },
  data: () => ({
    url: `${window.location.origin}/`,
    countAll: '',
    pageIndex: 1,
    pageSize: 10,
    sortField: "price",
    sort: 'asc',
    products: [],
    count: 0,
    addForm: false,
    productName: "",
    productPrice: ""
  }),
  methods: {
    async getProducts() {
      const response = await fetch(this.url + `products?pageIndex=${this.pageIndex}&pageSize=${this.pageSize}&sortField=${this.sortField}&sort=${this.sort}`);
      this.products = await response.json();
      await this.getProductCount();
    },
    async deleteProduct(index = "") {
      fetch(this.url + `products/${index}`, {
        method: 'DELETE',
        mode: 'cors',
        cache: 'no-cache',
      }).then((res) => {
        if (res.status !== 200)
          alert('Something went wrong')
        this.getProducts();
      })
    },
    addProduct() {
      fetch(this.url + `products/`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({name: this.productName, price: this.productPrice}),
      }).then((res) => {
        if (res.status !== 200)
          alert('Something went wrong')
        this.getProducts();
        this.productName = '';
        this.productPrice = '';
      })
    },
    async getProductCount() {
      const response = await fetch(this.url + `products/count`);
      this.countAll = await response.text();
    },
    async getMinPriceProduct() {
      const response = await fetch(this.url + `products/cheapest`);
      alert(`Product cheapest: ${await response.text()}`);
    },
    async getMaxPriceProduct() {
      const response = await fetch(this.url + `products/expensivest`);
      alert(`Product expensivest: ${await response.text()}`);
    },
    async getMedianPriceProduct() {
      const response = await fetch(this.url + `products/median`);
      alert(`Product median: ${await response.text()}`);
    },
    async getProductById() {
      let id = prompt("Enter id: ", "");
      if (id === "" || isNaN(id))
        return alert('Incorrect id');
      const response = await fetch(this.url + `products/${id}`);
      alert(`Product count: ${await response.text()}`);
    },
  },
  watch: {
    pageIndex() {
      this.getProducts();
    },
    sortField() {
      this.getProducts();
    },
    sort() {
      this.getProducts();
    },
    pageSize() {
      this.getProducts();
    }
  },
}

</script>
<style lang="sass" scoped>
.logo
  height: 6em
  padding: 1.5em
  will-change: filter

tr
  border-bottom: solid 1px white

tr.data-row:hover
  background-color: #0ff3

table
  border: solid 2px
  border-radius: 1rem
  padding: 1rem
  width: 100%

.form
  padding: 1rem
  margin: 1rem
  border: solid 2px
  border-radius: 1rem

input
  width: 5rem
  height: 1.5rem
  border-radius: 1rem

select
  width: 5rem
  height: 1.5rem
  border-radius: 1rem

.counter
  color: cyan
</style>
