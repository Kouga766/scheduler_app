<template>
  <v-app id="app">

    <NavDrawer v-if="showNav" /> <!--こいつもtoggleで同時に更新したい  /-->
    <NavHeader />

    <v-main> 

      <router-view
       v-if="showChild" 
       @update-self="updateSelf"
       @update-nav="updateNav"
       @completed="showSnackbar" 
      /> <!--TaskPage⇒ task-page に自動で読み替えられる  /-->
      
      <v-snackbar
            v-model="snackbar"
            :timeout="3000"
            >
            {{ snackbarText }}
            <template v-slot:action="{ attrs }">
              <v-btn
                  color="pink"
                  text
                  v-bind="attrs"
                  @click="snackbar = false"
              >
                Close
              </v-btn>
            </template>
        </v-snackbar>

    </v-main>

  </v-app>
</template>

<script>
import Vue from 'vue';
import NavDrawer from './components/NavDrawer.vue'
import NavHeader from './components/NavHeader.vue'

export default Vue.extend({

  components: {
    NavDrawer,
    NavHeader,
  },

  name: 'App',

  // 変数名は小文字指定がよい

  data: function() {
    return { // ここのreturnで設定している値はデフォルト値っぽい 内部で使う関数を全て最初に定義する（mount前にreturnされるデータっぽい）
      snackbar: false,

      snackbarText: `Task Completed!`,

      displayState: '0',

      showChild: true,

      showNav: true,
    };
  },
  
  methods: {
    
    // このあたりで再マウントし、画面上の情報を適宜更新する

    updateSelf() {
      this.showChild = false;
      this.$nextTick(() => (this.showChild = true));
    },

    updateNav() {
      this.showNav = false;
      this.$nextTick(() => (this.showNav = true));
    },

    showSnackbar() {
      this.snackbar = true;
    },
  },

});
</script>
