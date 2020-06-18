const INNITIAL_STATE = {
    modalShow : false 
}

export const ModalReducer = (state=INNITIAL_STATE, action) => {
    switch(action.type){
        case 'MODAL_SHOW' :
            return {
                modalShow : !state.modalShow
            }
        default : 
            return state
    }
}