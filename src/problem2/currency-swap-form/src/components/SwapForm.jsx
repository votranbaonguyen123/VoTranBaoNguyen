import { ProCard, ProForm, ProFormDigit } from '@ant-design/pro-components';
import { SwapRightOutlined, SwapLeftOutlined } from '@ant-design/icons';
import { Button, Select, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const { Title } = Typography

const swapStatusMap = {
    leftToRight: 1,
    rightToLeft: 2
}

const SwapForm = () => {
    const formRef = useRef()
    const [prices, setPrices] = useState({});
    const [currencyOption, setCurrencyOption] = useState([])
    const [swapStatus, setSwapStatus] = useState(swapStatusMap.leftToRight)
    const [leftCurrency, setLeftCurrency] = useState(null)
    const [rightCurrency, setRightCurrency] = useState(null)
    const getTokenIconUrl = (token) => {
        return `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${token}.svg`;
    };

    const caculateSwapData = (amount,fromCurrency,toCurrency) => {
        const fromPrice = prices[fromCurrency].price;
        const toPrice = prices[toCurrency].price;
        const swappedAmount = (amount * fromPrice) / toPrice;
        return swappedAmount
    }

    const handleSwap = () => {
        formRef.current.validateFields()
            .then((formValue) => {
                if(swapStatus === swapStatusMap.leftToRight){
                    formRef.current.setFieldValue('amountReceive', caculateSwapData(formValue.amountSend, leftCurrency, rightCurrency))
                }else {
                    formRef.current.setFieldValue('amountSend', caculateSwapData(formValue.amountReceive, rightCurrency,leftCurrency ))
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleChangeSwapStatus = () => {
        if (swapStatus === swapStatusMap.leftToRight) {
            setSwapStatus(swapStatusMap.rightToLeft)
        } else {
            setSwapStatus(swapStatusMap.leftToRight)
        }
    }

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const response = await axios.get('https://interview.switcheo.com/prices.json');
                setPrices(response.data);
                setCurrencyOption(response.data.map((currency, index) => {
                    return {
                        value: index,
                        label: (<div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <img src={getTokenIconUrl(currency.currency)} style={{ width: 20, height: 20 }} />
                            <span>{currency.currency}</span>
                        </div>)
                    }
                }))
            } catch (error) {
                console.error('Error fetching token prices', error);
            }
        };

        fetchPrices();
    }, []);

    return (
        <ProCard bordered boxShadow>
            <Title level={3} style={{ marginTop: 0 }}>Currency Swap</Title>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ProForm submitter={false} style={{ width: '80%' }} formRef={formRef}>
                    <ProForm.Group align='center'>
                        <ProFormDigit

                            min={0}
                            addonAfter={<Select options={currencyOption}
                                style={{ width: 120 }} value={leftCurrency} onChange={setLeftCurrency} />}
                            placeholder={''}
                            label={'Amount to send'}
                            width={'sm'}
                            rules={[
                                {
                                    required: swapStatus === swapStatusMap.leftToRight,
                                    message: "You need to input a number"
                                },
                                {
                                    message: "You need to choose a currency",
                                    validator: (_, value) => {
                                        if (leftCurrency === null) {
                                            return Promise.reject('Not choose currency yet');
                                        } else return Promise.resolve();
                                    }
                                }
                            ]}
                            name="amountSend"
                        />
                        <Button icon={swapStatus === swapStatusMap.leftToRight ? <SwapRightOutlined /> : <SwapLeftOutlined />} onClick={handleChangeSwapStatus}></Button>
                        <ProFormDigit
                            min={0}
                            addonAfter={<Select options={currencyOption}
                                style={{ width: 120 }} value={rightCurrency} onChange={setRightCurrency} />}
                            placeholder={''}
                            label={'Amount to receive'}
                            width={'sm'}
                            name="amountReceive"
                            rules={[
                                {
                                    required: swapStatus === swapStatusMap.rightToLeft,
                                    message: "You need to input a number"
                                },
                                {
                                    message: "You need to choose a currency",
                                    validator: (_,value) => {
                                        if(rightCurrency === null){
                                            return Promise.reject('Not choose currency yet');
                                        }else return Promise.resolve();
                                    }
                                }
                            ]}
                        />
                        <Button type='primary' onClick={handleSwap}>Confirm Swap</Button>
                    </ProForm.Group>

                </ProForm>
            </div>
        </ProCard>
    )
}

export default SwapForm
