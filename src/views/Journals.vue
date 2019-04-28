<template>
    <div class="page journals">
        <h1>Journals page</h1>

        <v-layout>
            <v-card>


                <v-data-table
                  :headers="headers"
                  :items="results"
                  class="elevation-1"
                >
                  <template v-slot:items="props">
                    <td >{{ props.item.journal_name }}</td>
                    <td class="text-xs-right">{{ props.item.num_dois }}</td>
                    <td class="text-xs-right">{{ parseInt(props.item.proportion_oa * 100) }}</td>
                    <td class="text-xs-right">{{ parseInt(props.item.proportion_bronze * 100)}}</td>
                    <td class="text-xs-right">{{ parseInt(props.item.proportion_green * 100)}}</td>
                    <td class="text-xs-right">{{ parseInt(props.item.proportion_hybrid * 100)}}</td>
                  </template>
                </v-data-table>



<!--                <v-list two-line>-->
<!--                    <template v-for="(result, index) in results">-->
<!--                        <v-list-tile :key="result.title">-->
<!--                            <v-list-tile-content>-->
<!--                                <v-list-tile-title v-html="result.journal_name"></v-list-tile-title>-->
<!--                            </v-list-tile-content>-->
<!--                        </v-list-tile>-->
<!--                    </template>-->
<!--                </v-list>-->

            </v-card>



        </v-layout>




    </div>
</template>

<script>
    import axios from 'axios'


    export default {
        name: 'Journals',
        data: () => ({
           results: [],
            headers: [
                {text: "Journal name", value: "journal_name"},
                {text: "Num DOIs", value: "num_dois"},
                {text: "Any OA (%)", value: "proportion_oa"},
                {text: "Bronze (%)", value: "proportion_bronze"},
                {text: "Green (%)", value: "proportion_green"},
                {text: "Hybrid (%)", value: "proportion_hybrid"}
            ],


            headers1: [
                "Journal name",
                "Num DOIs",
                "Total OA (%)",
                "Bronze (%)",
                "Green (%)",
                "Hybrid (%)"
            ]
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

    table.v-table tbody {
        td {
            font-size: 16px;
            &:first-child {
                padding-top: 10px;
                padding-bottom: 10px;

            }
        }


    }


</style>
