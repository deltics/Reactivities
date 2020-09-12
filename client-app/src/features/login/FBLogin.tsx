import React from "react";
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import {Button, Icon} from "semantic-ui-react";


const FBLogin: React.FC<{ callback: (response: any) => void, loading: boolean }> = ({callback, loading}) => {

    return (
        <div>
            <FacebookLogin appId={"628227864554429"}
                           fields={"name,email,picture"}
                           callback={callback}
                           render={(renderProps: any) => (
                               <Button loading={loading}
                                       onClick={renderProps.onClick}
                                       type={"button"}
                                       fluid
                                       color={"facebook"}>
                                   <Icon name={"facebook"}/>
                                   Login with Facebook
                               </Button>
                           )}/>
        </div>
    );
}

export default FBLogin;