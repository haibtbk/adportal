'use strict'
module.exports = {
    ref: null,
    register(ref) {
        console.log({ref})
        this.ref = ref
    },
    unregister() {
        this.ref = null
    },
    showAlert(info ) {
        this.ref.show(info)
    },
    hideAlert() {
        this.ref.hide()
    }, 
    hideAllAlert(){
        this.ref.hideAll()
    }
}