<template>
    <div class="home">


        <v-container grid-list-lg>
            <v-layout row wrap>
                <v-flex md6>
                    <v-card>
                        <v-card-title primary-title>
                            <div>
                                <h3 class="headline mb-0">Journals</h3>
                                <div> Lorem ipsum dolor sit amet, brute iriure accusata ne mea. Eos suavitate referrentur ad, te duo agam libris qualisque, utroque quaestio accommodare no qui. Et percipit laboramus usu, no invidunt verterem nominati mel. Dolorem ancillae an mei, ut putant invenire splendide mel, ea nec propriae adipisci. Ignota salutandi accusamus in sed, et per malis fuisset, qui id ludus appareat
                                </div>
                            </div>
                        </v-card-title>

                        <v-card-actions>
                            <v-btn to="./journals" flat>View Journals</v-btn>
                        </v-card-actions>
                    </v-card>

                </v-flex>

                <v-flex md6>
                    <v-card>
                        <v-card-title primary-title>
                            <div>
                                <h3 class="headline mb-0">Articles</h3>
                                <div> Lorem ipsum dolor sit amet, brute iriure accusata ne mea. Eos suavitate referrentur ad, te duo agam libris qualisque, utroque quaestio accommodare no qui. Et percipit laboramus usu, no invidunt verterem nominati mel. Dolorem ancillae an mei, ut putant invenire splendide mel, ea nec propriae adipisci. Ignota salutandi accusamus in sed, et per malis fuisset, qui id ludus appareat
                                </div>
                            </div>
                        </v-card-title>

                        <v-card-actions>
                            <v-btn flat to="./articles">Find Articles</v-btn>
                        </v-card-actions>
                    </v-card>

                </v-flex>




            </v-layout>

        </v-container>



    </div>
</template>

<script>


    export default {
        name: 'home',
        methods: {}
    }
</script>


<style scoped lang="scss">


</style>
