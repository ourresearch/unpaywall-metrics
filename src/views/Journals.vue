<template>
    <div class="page journals">
        <h1>Journals page</h1>

        <v-layout>
            <v-card>
                <v-list two-line>
                    <template v-for="(result, index) in results">
                        <v-list-tile :key="result.title">
                            <v-list-tile-content>
                                <v-list-tile-title v-html="result.journal_name"></v-list-tile-title>

                            </v-list-tile-content>




                        </v-list-tile>




                    </template>



                </v-list>



            </v-card>



        </v-layout>




    </div>
</template>

<script>
    import axios from 'axios'


    export default {
        name: 'Journals',
        data: () => ({
           results: []
        }),
        methods: {
            fetch(){
               let url = "https://api.rickscafe.io/unpaywall-metrics/subscriptions?bigdeal=cdl_elsevier"
                return axios.get(url)
                    .then(resp => {
                        console.log("got search results back", resp.data.list)

                        // use the nifty spread operator since push() requires multiple args
                        // rather than a single array https://stackoverflow.com/a/1374131/226013
                        this.results = resp.data.list
                        return true
                    })
                    .catch(e => {
                        console.log("error from server", e)
                        return false
                    })
            }
        },
        mounted(){
            this.fetch()
        }
    }
</script>


<style scoped lang="scss">



</style>
