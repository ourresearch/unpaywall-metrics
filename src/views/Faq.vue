<template>
    <v-container>
        <v-layout row>
            <v-flex>
                <v-card min-height="400">
                    <v-card-title>
                        <div>
                            <h1 class="headline mb-4">Frequently Asked Questions</h1>

                            <h2 class="title mt-4 my-1">Why was this website created?</h2>
                            <p>
                                The University of California wants to capture and openly surface data about the journals
                                and articles that are no longer available due to the cancellation of its contract with
                                Elsevier, as well as open access options where available. This site was built by
                                <a href="https://our-research.org">Our Research</a> with support from the <a href="https://www.cdlib.org/">California
                                Digital Library</a> (part of UC).
                            </p>


                            <h2 class="title mt-4 my-1">What is the source for the data on affected journals and
                                articles?</h2>
                            <p>
                                This site is built on data from <a href="https://unpaywall.org">Unpaywall</a> combined
                                with data from UC on affected journals.
                            </p>

                            <h2 class="title mt-4 my-1">What are the options for downloading these data sets?</h2>
                            <p>
                                Downloads of journal and article data sets are available in both CSV and JSON formats.
                                CSV is offered for the sake of convenience and as a common standard format. JSON has the
                                advantage of being easier to work with and parse at this scale.
                            </p>

                            <h2 class="title mt-4 my-1">Is the data updated regularly?</h2>
                            <p>
                                Data is updated nightly.
                            </p>

                            <h2 class="title mt-4 my-1">How do I get access to content without an open access copy?</h2>
                            <p>
                                See the <a href="https://osc.universityofcalifornia.edu/open-access-at-uc/publisher-negotiations/alternative-access-to-articles/">UC Alternative Access website</a> for more information on alternative ways to access content without an open access copy.

                            </p>


                        </div>


                    </v-card-title>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        name: "Faq"
    }
</script>

<style scoped>

</style>