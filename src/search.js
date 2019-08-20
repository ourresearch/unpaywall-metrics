import axios from 'axios'
import _ from 'lodash'



class UserInput {
    constructor(defaultValue) {
        this.default = defaultValue
        this.selected = defaultValue
    }
    set(newVal){
        this.selected = newVal
    }
    reset(){
        this.selected = this.default
    }

    getString() {
        return String(this.selected)
    }

    isDefault() {
        return this.getString() === String(this.default)
    }

}


class UserInputBool extends UserInput {
    constructor(defaultValue) {
        super(defaultValue)
    }

    setFromStr(newVal) {
        this.selected = this.default
        if (["1", "yes", "true"].includes(newVal)) {
            this.selected = true
        } else if (["0", "no", "false"].includes(newVal)) {
            this.selected = false
        }
    }

}

class UserInputString extends UserInput {
    constructor(defaultValue) {
        super(defaultValue)
    }

    setFromStr(newVal) {
        this.selected = this.default
        if (typeof newVal === "string") {
            this.selected = newVal
        }
    }
}


class UserInputInt extends UserInput {
    constructor(defaultValue) {
        super(defaultValue)
    }

    setFromStr(newVal) {
        this.selected = this.default
        if (typeof newVal === "string") {
            this.selected = parseInt(newVal)
        }
    }
}


class UserInputList extends UserInput {
    // this is a work in progress. see the geo version of this (unpaywall-analytics-webapp) for code that handles arrays as a type of user input.

    constructor(defaultValue, choices) {
        super(defaultValue)
        this.choices = choices
    }

    setFromStr(newVal) {
        if (!newVal) {
            newVal = this.default
        } else if (newVal.indexOf(",") > -1) {
            newVal = newVal.split(",")
            newVal.sort()
        }
        this.selected = newVal
    }

    getForUrl() {
        if (this.getString() === this.default.toString()) {
            return
        }
        return this.getString()
    }

    getAsKey() {
        return this.getString().replace(/,/g, "_")
    }

    getString() {
        let selected
        if (Array.isArray(this.selected)) {
            selected = this.selected.concat().sort().join()
        } else {
            selected = this.selected.slice()
        }
        return selected
    }

}



export const articleSearch = {
    loading: false,
    loadingState: "ready",
    results: [],
    resultsCount: 0,
    resultsPerPage: 20,
    db: [],
    params: {
        isOa: new UserInputBool(false),
        page: new UserInputInt(1),
        q: new UserInputString("")
    },
    baseUrl: "https://api.cdl.metrics.unpaywall.org/articles",


    // this is for if you are doing filtering on the server, so you are making
    // a new API call to reflect the current state of the search params.
    getApiUrl: function () {
        let params = this.getParams(true)
        console.log("using these params to create search URL", params)
        let queryObj = new URLSearchParams
        let paramsStr = Object.entries(params)
            .forEach(([paramName, paramVal]) => {
                queryObj.append(paramName, paramVal)
            })

        // hack to handle naming issue in API signature
        let queryStr = queryObj.toString()
            .replace("isOa=false", "oa_host=none")
            .replace("isOa=true", "oa_host=any")

        return [this.baseUrl, queryStr].join("?")
    },

    getParams(hideDefaultValues){
        let ret = {}
        Object.entries(this.params).forEach(([paramName, paramObj]) => {
            if (hideDefaultValues && paramObj.isDefault()) {
                return true // continue looping
            }
            else {
                ret[paramName] = paramObj.getString()
            }
        })
        return ret
    },

    getNumPages(){
      return Math.ceil(this.resultsCount / this.resultsPerPage)
    },
    getPageOffsets(){
        let startOffset = this.params.page.selected * this.resultsPerPage - (this.resultsPerPage - 1)
        let endOffset = startOffset + 19
        if (endOffset > this.resultsCount){
            endOffset = this.resultsCount
        }
        return {
            start: startOffset,
            end: endOffset
        }
    },


    fetchResults: function () {
        this.loadingState = "loading"
        let url = this.getApiUrl()
        console.log("fetching article results from", url)
        let request = axios.get(url)
            .then(resp => {
                console.log("got article data back")
                this.results = resp.data.list
                this.resultsCount = resp.data.total_count

            })
            .catch(e => {
                console.log("article API error", e)
            })
            .finally(() => {
                this.loadingState = "complete"
            })
        return request
    },

    setUserInputsFromUrl(queryObj) {
        for (const k in this.params) {
            this.params[k].setFromStr(queryObj[k])
        }

    },

    getUserInputsForUrl() {
        let ret = {}
        Object.entries(this.userInputs).forEach(([userInputName, userInput]) => {
            if (userInput.getForUrl()) {
                ret[userInputName] = userInput.getForUrl()
            }
        })
        return ret

    },
    incrementYear() {
        let intYear = parseInt(userInputs.year.selected)
        if (intYear < 2018) {
            intYear += 1
        }

        userInputs.year.selected = intYear.toString()
    },
    decrementYear() {
        let intYear = parseInt(userInputs.year.selected)
        if (intYear > 2009) {
            intYear -= 1
        }
        console.log("intyear", intYear)
        userInputs.year.selected = intYear.toString()

    }


}