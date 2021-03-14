import { MailOutlined } from "@ant-design/icons";
import { RouteComponentProps } from "@reach/router"
import { Button } from "antd";
import { Content } from "antd/lib/layout/layout";
import { useEffect } from "react";
import { useUser } from "../../../../HOC/AuthContext";

const Settings: React.FC<RouteComponentProps | any> = () => {
    const { user } = useUser();
    useEffect(() => {

    }, [])
    function reportBug() {
        window.open(`mailto:rasim.karimli@gmail.com?subject=MangaAzBug&body=Səhvi ətraflı təsvir edin, tercihen bir şəkil ilə.`);
    }
  
    return (
        <div>
            <Content
                className="site-layout-background"
                style={{
                    padding: 24,
                    margin: 0,
                    minHeight: 280,
                }}
            >
                <Button type="primary" onClick={reportBug}>Səhv bildirin<MailOutlined /></Button>
            </Content>
        </div>
    )
}

export default Settings
