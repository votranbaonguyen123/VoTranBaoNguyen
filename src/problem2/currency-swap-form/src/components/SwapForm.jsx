import { ProCard, ProForm, ProFormDigit } from '@ant-design/pro-components';
import { Button, Select, Typography } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';

const { Title } = Typography

const SwapForm = () => {
    const [prices, setPrices] = useState({});
    const [currencyOption, setCurrencyOption] = useState([])
    const getTokenIconUrl = (token) => {
        return `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${token}.svg`;
    };

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const response = await axios.get('https://interview.switcheo.com/prices.json');
                setPrices(response.data);
                setCurrencyOption(response.data.map((currency, index) => {
                    console.log(currency)
                    return {
                        value: index,
                        label: (<div style={{display:'flex', alignItems:'center', gap: 5}}>
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
                <ProForm submitter={false} style={{ width: '80%' }}>
                    <ProForm.Group align='center'>
                        <ProFormDigit required min={0} addonAfter={<Select options={currencyOption} style={{ width: 120 }} />} placeholder={''} label={'Amount to send'} width={'sm'} />
                        <ProFormDigit required min={0} addonAfter={<Select options={currencyOption} style={{ width: 120 }} />} placeholder={''} label={'Amount to receive'} width={'sm'} />
                        <Button type='primary'>Confirm Swap</Button>
                    </ProForm.Group>

                </ProForm>
            </div>
        </ProCard>
    )
}

export default SwapForm
