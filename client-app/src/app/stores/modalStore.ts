import {RootStore} from "./rootStore";
import {action, observable} from "mobx";


class ModalStore {

    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }


    @observable.shallow modal = {   // Shallow observables will not attempt to deep-observe inside any objects (e.g. 'body' in this case)
        open: false,
        body: null
    }


    @action openModal = (content: any) => {
        this.modal.open = true;
        this.modal.body = content;
    }


    @action closeModal = () => {
        this.modal.open = false;
        this.modal.body = null;
    }
}


export default ModalStore;