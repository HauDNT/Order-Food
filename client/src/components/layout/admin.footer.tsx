'use client'
import { Layout } from "antd";

const AdminFooter = () => {
    const { Footer } = Layout;

    return (
        <Footer style={{ textAlign: 'center' }}>
            OrderFood ©{new Date().getFullYear()} Created by @orderfood
        </Footer>
    )
}

export default AdminFooter;