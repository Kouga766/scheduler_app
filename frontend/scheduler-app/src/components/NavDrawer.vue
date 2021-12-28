<template>
    <v-card> <!-- drawerなどにはappが必要です-->
      <v-navigation-drawer
      app
      permanent
      expand-on-hover
      >
        <v-list>
          <v-list-item class="px-2">
            <v-list-item-avatar>
              <v-img src=""></v-img>
            </v-list-item-avatar>
          </v-list-item>

          <v-list-item link to="/">
            <v-list-item-content>
              <v-list-item-title class="text-h6">
                Hiroki Nakamura
              </v-list-item-title>
              <v-list-item-subtitle>johndoe@dummy.co.jp</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list nav dense>

          <v-list-item link to="/tasks">
              <v-list-item-icon> <!--iconの中にbadgeを入れるべし-->
                <v-icon class="md-18">mdi-calendar-check</v-icon>
                <v-badge
                 color="red"
                 :content="dueTodayCount"
                 v-if="showBadge">
                  
                </v-badge>
              </v-list-item-icon>
            <v-list-item-title>Tasks</v-list-item-title>
          </v-list-item>

          <v-list-item link to="/notes">
            <v-list-item-icon>
              <v-icon class="material-icons md-18">mdi-animation</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Notes</v-list-item-title>
          </v-list-item>

          <v-list-item link to="/settings">
            <v-list-item-icon>
              <v-icon class="material-icons md-18">mdi-cogs</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item>

        </v-list>
      </v-navigation-drawer>
    </v-card>
</template>


<script>
import Vue from 'vue';

export default Vue.extend({

  mounted() {
    this.dueTodayCount = Vue.prototype.$dueTodayCount;
    if (this.dueTodayCount !== 0) {
      this.showBadge = true;
    }
  },

  data: function() {
    if (Vue.prototype.$dueTodayCount === undefined) Vue.prototype.$dueTodayCount = 0;

    return { 
      dueTodayCount: 0,
      showBadge: false,
    }
  },

})
</script>
