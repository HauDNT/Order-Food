'use client'
import { Layout } from 'antd';

const AdminContent = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    const { Content } = Layout;

    return (
        <Content style={{ margin: '24px 16px 0' }}>
            <div
                style={{
                    padding: 24,
                    minHeight: 360,
                    background: '#ccc',
                    borderRadius: '#000',
                }}
            >
                {children}
            </div>
        </Content>
    )
}

export default AdminContent;