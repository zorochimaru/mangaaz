import { Button } from 'antd';
import React, { CSSProperties, useContext } from 'react'
import GoogleLogin from 'react-google-login';
import { UserContext } from '../HOC/AuthContext';
import { User } from '../models/User.model';



const Auth: React.FC<any> = () => {
    const { setUser } = useContext(UserContext);
    function handleUser(data: any) {
        const user: User = {
            name: data?.profileObj.name,
            img: data?.profileObj.imageUrl
        }
        console.log(data);
        setUser(user);
    }

    return (
        <>

            <GoogleLogin
                clientId="437719121554-js6i123m23eipkp0njnnc8rp4usatgt8.apps.googleusercontent.com"
                render={renderProps => (
                    <Button style={styles.login} onClick={renderProps.onClick} disabled={renderProps.disabled}>Login</Button>
                )}
                onSuccess={(data) => handleUser(data)}
                // onFailure={logoutHandler}
                isSignedIn={true}
            />
        </>
    )
}
const styles: { [key: string]: CSSProperties } = {
    login: {
        position: 'absolute',
        right: 20,
    }
}
export default Auth
