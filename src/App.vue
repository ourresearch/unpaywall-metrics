<template>

  <v-app id="inspire">
<!--    <v-navigation-drawer-->
<!--      fixed-->
<!--      v-model="drawer"-->
<!--      app-->
<!--    >-->
<!--      <v-list dense>-->
<!--        <v-list-tile to="/">-->
<!--          <v-list-tile-action>-->
<!--            <v-icon>home</v-icon>-->
<!--          </v-list-tile-action>-->
<!--          <v-list-tile-content>-->
<!--            <v-list-tile-title>Home</v-list-tile-title>-->
<!--          </v-list-tile-content>-->
<!--        </v-list-tile>-->

<!--        <v-list-tile to="./journals">-->
<!--          <v-list-tile-action>-->
<!--            <v-icon>contact_mail</v-icon>-->
<!--          </v-list-tile-action>-->
<!--          <v-list-tile-content>-->
<!--            <v-list-tile-title>Journals</v-list-tile-title>-->
<!--          </v-list-tile-content>-->
<!--        </v-list-tile>-->

<!--        <v-list-tile to="./articles">-->
<!--          <v-list-tile-action>-->
<!--            <v-icon>contact_mail</v-icon>-->
<!--          </v-list-tile-action>-->
<!--          <v-list-tile-content>-->
<!--            <v-list-tile-title>Articles</v-list-tile-title>-->
<!--          </v-list-tile-content>-->
<!--        </v-list-tile>-->

<!--      </v-list>-->
<!--    </v-navigation-drawer>-->

    <v-toolbar color="gold" dark fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer" class="hidden-sm-and-up"></v-toolbar-side-icon>
      <v-toolbar-title>
        <v-btn flat to="/" active-class="">
        UC Elsevier cancellation browser

        </v-btn>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat to="./subscriptions">subscriptions</v-btn>
        <v-btn flat to="./articles">articles</v-btn>
        <v-btn flat to="./faq">faq</v-btn>
      </v-toolbar-items>

    </v-toolbar>

    <v-content>
      <v-container fluid fill-height>
        <v-layout
          justify-center
        >

          <router-view></router-view>

<!--          <v-flex text-xs-center>-->
<!--            <v-tooltip left>-->
<!--              <v-btn icon large :href="source" target="_blank" slot="activator">-->
<!--                <v-icon large>code</v-icon>-->
<!--              </v-btn>-->
<!--              <span>Source</span>-->
<!--            </v-tooltip>-->
<!--          </v-flex>-->

        </v-layout>
      </v-container>
    </v-content>
  </v-app>



</template>

<script>
  import MainHeader from './components/MainHeader'
  import MainFooter from './components/MainFooter'
  export default {
      name: 'App',
    data: () => ({
    drawer: null
  }),
      components: {
          MainHeader,
          MainFooter
      },
      metaInfo: {
        // if no subcomponents specify a metaInfo.title, this title will be used
        title: 'Unpaywall Metrics'
      }
  }
</script>

<style lang="scss">

  @import url("https://use.fontawesome.com/releases/v5.0.10/css/all.css");
  @import url("https://fonts.googleapis.com/css?family=Lato:300,400,700,400italic");







  $primary-color: #FF3D00;

  $screen-xsmall: 600px;
  $screen-small: 960px;


  html {
    &.noscroll {
      overflow: hidden
    }
  }

  body {
    font-size: 16px;
    font-family: Lato, sans-serif;
    &.noscroll {
      overflow: hidden
    }
  }


</style>
