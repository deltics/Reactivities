import React, {useContext} from 'react';
import {Modal} from 'semantic-ui-react';
import {RootStoreContext} from "../../stores/rootStore";
import {observer} from "mobx-react-lite";


const ModalContainer = () => {

    const {modalStore} = useContext(RootStoreContext);

    return (
        <Modal open={modalStore.modal.open}
               onClose={modalStore.closeModal}
               size='mini'>
            <Modal.Content>
                {modalStore.modal.body}
            </Modal.Content>
        </Modal>
    );
}


export default observer(ModalContainer);