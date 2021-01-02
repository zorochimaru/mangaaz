import { RouteComponentProps } from '@reach/router'
import Title from 'antd/lib/typography/Title'
import React from 'react'

const Reader: React.FC<RouteComponentProps | any> = (props) => {
    return (
        <div>
            <Title level={2}>Reader comming soon</Title>
        </div>
    )
}

export default Reader
