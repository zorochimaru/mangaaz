import { Redirect } from "@reach/router";
import { useUser } from "./AuthContext";

export const PrivateRoute = (props: any) => {
    const { user } = useUser();
    let { as: Comp, ...otherProps } = props;

    return user && user? (
        <Comp {...otherProps} />
    ) : (
            <Redirect to="/" replace={true} noThrow={true} />
        );
};