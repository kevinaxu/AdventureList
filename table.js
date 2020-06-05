function datatables() {
  return {
    headings: [
      {
        'key': 'brandName',
        'value': 'Brand'
      },
      {
        'key': 'productName',
        'value': 'Product'
      },
      {
        'key': 'quantity',
        'value': 'Quantity'
      },
      {
        'key': 'phoneNumber',
        'value': 'Phone'
      }
    ],
    products: [{
      "productId": 1,
      "brandName": "REI",
      "productName": "Big Agnes XL",
      "productUrl": "https://www.rei.com/product/169936/big-agnes-insulated-q-core-deluxe-sleeping-pad",
      "quantity": "15.4 lbs",

      "phoneNumber": "327-626-5542"
    }, {
      "productId": 2,
      "brandName": "Black Diamond",
      "productName": "Metal Pitons",
      "productUrl": "https://www.blackdiamondequipment.com/en_US/lost-arrowr-pitons-BD520500_cfg.html",
      "quantity": "2.3 lbs",

      "phoneNumber": "144-190-8956"
    }, {
      "productId": 3,
      "brandName": "Kelty",
      "productName": "Sleeping Pillow - Inflatable",
      "productUrl": "https://www.rei.com/rei-garage/product/883248/kelty-luxury-pillow",
      "quantity": "0.8 lbs",

      "phoneNumber": "350-937-0792"
    }, {
      "productId": 4,
      "brandName": "Canada Goose",
      "productName": "Alpine AScenders Outer Shell",
      "productUrl": "https://www.rei.com/product/856991/canada-goose-camp-hooded-down-jacket-womens",
      "quantity": "3.4 lbs",

      "phoneNumber": "502-438-7799"
    }, {
      "productId": 5,
      "brandName": "Patagonia",
      "productName": "Synchilla Rugby Fleece - Green",
      "productUrl": "https://www.rei.com/product/853372/patagonia-lightweight-synchilla-snap-t-fleece-pullover-womens",
      "quantity": "1.4 lbs",

      "phoneNumber": "265-448-9627"
    }],


    selectedRows: [],

    open: false,

    /**
     * Displays/Hides a Column
     *
     * Iterate over all columns:
     *  - If it's in a  hidden state, then remove the hidden attribute
     *  - If it's displaying, add hidden state
     *
     * @param key string
     */
    toggleColumn(key) {
      // Note: All td must have the same class name as the headings key!
      let columns = document.querySelectorAll('.' + key);

      if (this.$refs[key].classList.contains('hidden') && this.$refs[key].classList.contains(key)) {
        columns.forEach(column => {
          column.classList.remove('hidden');
        });
      } else {
        columns.forEach(column => {
          column.classList.add('hidden');
        });
      }
    },

    getRowDetail($event, id) {
      console.log("getRowDetail()");
      let rows = this.selectedRows;

      if (rows.includes(id)) {
        let index = rows.indexOf(id);
        rows.splice(index, 1);
      } else {
        rows.push(id);
      }
    },

    selectAllCheckbox($event) {
      console.log("selectAllCheckbox()");
      let columns = document.querySelectorAll('.rowCheckbox');

      this.selectedRows = [];

      if ($event.target.checked == true) {
        columns.forEach(column => {
          column.checked = true
          this.selectedRows.push(parseInt(column.name))
        });
      } else {
        columns.forEach(column => {
          column.checked = false
        });
        this.selectedRows = [];
      }
    }
  }
}
