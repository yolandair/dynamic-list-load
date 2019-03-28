const DataProcess = require('@cnpm/data-process');
const ComputationTime = require('@cnpm/computation-time');
const Vue = require('@third/vue');
const ImageLazyload = require('@cnpm/image-lazyload');
const VueJsonP = require('vue-jsonp');

require('./style.css');

Vue.use(VueJsonP);

/**
 * 动态列表加载
 */
let getListAjaxURL;
let lastitemtime = '';
let imageLazyload;
let ajaxLock = false;

const DynamicListLoad = new Vue({
  el: '#newsList',
  data: {
    itemList: []
  },
  created() {
    let T = this;
    this.fetchListData(0);
    window.onscroll = () => {
      imageLazyload.update();
      if ((window.innerHeight + 10) - document.getElementById('moreLoading').getBoundingClientRect().bottom > 0) {
        T.fetchListData();
      }
    };
  },
  mounted() {
    this.$nextTick(() => {
      imageLazyload = new ImageLazyload({
        elements: document.querySelectorAll('img[data-original]'),
        container: document.querySelector('.news-list')
      });
    });
  },
  updated() {
    imageLazyload.resetElement(document.querySelectorAll('img[data-original]'));
    imageLazyload.update();
    ComputationTime.chineseDateDiff($('.time'), 'data-time');
    this.navClick();
  },
  methods: {
    fetchListData(page) {
      let T = this;
      if (page == 0) {
        lastitemtime = '';
      }
      if (!ajaxLock) {
        ajaxLock = true;
        if (window.dataConfig == 'activ') {
          getListAjaxURL = document.querySelector('.activ').getAttribute('data-url');
        } else {
          getListAjaxURL = window.dataConfig;
        }
        this.$jsonp(getListAjaxURL + '&before=' + lastitemtime, {
          callbackQuery: 'jsonpcallback'
        }).then((json) => {
          if (json.results.length == 0) {
            document.querySelector('#moreLoading').firstElementChild.remove();
            document.querySelector('#moreLoading').lastElementChild.innerHTML = '没有更多数据';
            return;
          }
          let itemList = new DataProcess({
            dataArr: json.results
          });
          if (page !== 0) {
            itemList.forEach((val) => {
              T.itemList.push(val);
            });
          } else {
            T.itemList = [];
            T.itemList = itemList;
          }
          lastitemtime = ComputationTime.reduceOneSeconds(itemList[itemList.length - 1].PublishedAt);
          ajaxLock = false;
        }).catch((error) => {
          console.log(error);
          ajaxLock = false;
        });
      }
    },
    navClick() {
      let $scrollLi = document.querySelectorAll('.scroll-nav ul li');
      let T = this;
      for (let i = 0; i < $scrollLi.length; i++) {
        let j = i;
        $scrollLi[i].onclick = function (e) {
          for (let j = 0; j < $scrollLi.length; j++) {
            $scrollLi[j].className = '';
          }
          e.currentTarget.className = 'activ';
          T.fetchListData(0);
        };
      }
    }
  }
});

// module.exports = DynamicListLoad;
export default DynamicListLoad;
