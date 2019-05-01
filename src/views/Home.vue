<template>
    <div class="home">


        <v-container grid-list-lg>
            <v-layout row wrap>
                <v-flex md12>
                    <v-card>
                        <v-card-title primary-title>
                            <div>
                                <h3 class="headline mb-0">About this website</h3>
                                <div> CDL content goes here. Until then, some <a href="https://hipsum.co/?paras=5&type=hipster-centric&start-with-lorem=1">Hipster Ipsum:</a>  Lorem ipsum dolor amet scenester man bun synth semiotics vexillologist. Cred gluten-free venmo beard kitsch, cardigan edison bulb single-origin coffee meditation blog flexitarian kickstarter tote bag chartreuse. Green juice lumbersexual try-hard shabby chic, YOLO austin before they sold out gentrify roof party hell of hexagon trust fund brooklyn art party freegan. Hoodie copper mug small batch gastropub polaroid. Messenger bag beard shoreditch stumptown waistcoat 90's vice. Blog art party banh mi, mixtape humblebrag green juice vice four loko cliche brooklyn live-edge distillery pabst plaid dreamcatcher. Tousled sustainable chartreuse locavore, lumbersexual pickled forage intelligentsia schlitz lo-fi lomo.

                                </div>
                            </div>
                        </v-card-title>

                        <v-card-actions>
                            <v-btn to="./subscriptions" flat>View Journals</v-btn>
                            <v-btn flat to="./articles">Find Articles</v-btn>
                            <v-btn flat to="./faq">Read FAQ</v-btn>

                        </v-card-actions>
                    </v-card>

                </v-flex>





            </v-layout>


            <v-layout row>
                <v-flex xs12>
                    <v-card>
                        <v-card-title>
                            <h3 class="headline mb-0">Summary</h3>
                        </v-card-title>
                        <v-card-text>
                            <div>There's just placeholder images here for now.</div>
                            <img src="../assets/graph1.png" class="placeholder" alt="">
                            <img src="../assets/graph2.png" class="placeholder" alt="">
                            <img src="../assets/graph3.png" class="placeholder" alt="">

                        </v-card-text>

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
    img.placeholder {
        height: 200px;
        padding: 20px;
    }

</style>
