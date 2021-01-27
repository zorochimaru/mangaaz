import { RouteComponentProps } from "@reach/router"
import { useUser } from "../../../../HOC/AuthContext";

const Statistics: React.FC<RouteComponentProps | any> = () => {
    const {user} = useUser();
    return (
        <div>
            Heelo {user?.name}
        </div>
    )
}

export default Statistics
