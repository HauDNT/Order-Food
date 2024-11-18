"use client"
import { sendRequest } from "@/utils/api";
import { useHasMounted } from "@/utils/customHook";
import { SmileOutlined, SolutionOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, notification, Steps } from "antd";
import { Dispatch, SetStateAction, useState } from "react";

interface modalReactiveProps {
    isModalOpen: boolean,
    setModalOpen: Dispatch<SetStateAction<boolean>>,
    userEmail: string,
}

const ModalReactive = ({ isModalOpen, setModalOpen, userEmail }: modalReactiveProps) => {
    const hasMounted = useHasMounted();
    const [current, setCurrent] = useState(0);
    const [userId, setUserId] = useState(null);

    if (!hasMounted) return <></>;

    const onFinishStep0 = async (values: any) => {
        const { email } = values;

        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/retry-active`,
            method: "POST",
            body: {
                email,
            }
        });

        if (res?.data) {
            setCurrent(1);
            setUserId(res.data);
            notification.success({
                message: `Mã xác thực đã được gửi qua địa chỉ email ${userEmail}`,
            });
        }
        else {
            notification.error({
                message: "Đã xảy ra lỗi trong khi gửi mã xác thực",
                description: res?.message,
            });
        }
    };

    const onFinishStep1 = async (values: any) => {
        const { code } = values;

        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/check-code`,
            method: "POST",
            body: {
                _id: userId,
                code,
            }
        });

        if (res?.data) {
            setCurrent(2);
            notification.success({
                message: "Kích hoạt tài khoản thành công",
            });
        }
        else {
            notification.error({
                message: "Đã xảy ra lỗi trong khi kích hoạt lại tài khoản",
                description: res?.message,
            });
        }
    };

    return (
        <Modal
            title="Kích hoạt tài khoản"
            open={isModalOpen}
            onOk={() => setModalOpen(false)}
            onCancel={() => setModalOpen(false)}
            maskClosable={false}
            footer={null}
        >
            <Steps
                current={current}
                items={[
                    {
                        title: 'Login',
                        icon: <UserOutlined />,
                    },
                    {
                        title: 'Verification',
                        icon: <SolutionOutlined />,
                    },
                    {
                        title: 'Done',
                        icon: <SmileOutlined />,
                    },
                ]}
            />
            {current === 0 &&
                <>
                    <div style={{ margin: "20px 0" }}>
                        <p>Tài khoản của bạn chưa được kích hoạt</p>
                    </div>
                    <Form
                        name="verify"
                        onFinish={onFinishStep0}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item
                            name="email"
                            initialValue={userEmail}
                        >
                            <Input disabled />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Resend active code
                            </Button>
                        </Form.Item>
                    </Form>
                </>
            }

            {current === 1 &&
                <>
                    <div style={{ margin: "20px 0" }}>
                        <p>Vui lòng nhập mã xác nhận </p>
                    </div>
                    <Form
                        name="verify"
                        onFinish={onFinishStep1}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item
                            name="code"
                            label="Code"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập vào mã xác thực"
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Send
                            </Button>
                        </Form.Item>
                    </Form>
                </>
            }

            {current === 2 &&
                <>
                    <div style={{ margin: "20px 0" }}>
                        <p>Tài khoản được kích hoạt thành công. Vui lòng đăng nhập lại!</p>
                    </div>
                </>
            }
        </Modal>
    )
}

export default ModalReactive;