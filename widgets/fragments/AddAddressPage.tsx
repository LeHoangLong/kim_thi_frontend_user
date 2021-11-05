import { HeaderBar } from "../components/HeaderBar"
import styles from './AddAddressPage.module.scss'
import myContainer from "../../container"
import { IAddressRepository } from "../../repositories/IAddressRepository"
import Symbols from "../../config/Symbols"
import { useState } from "react"
import { setAddreses, setNumberOfAddresses } from "../../reducers/addressReducer"
import { PhoneInput } from "../components/PhoneInput"
import Loading from "../components/Loading"
import { useAppDispatch, useAppSelector } from "../../hooks/Hooks"
import { RootState } from "../../reducers/rootReducer"
import { UnsupportedCity } from "../../exceptions/UnsupportedCity"

export interface AddAddressPageProps {
    onBack() : void
}

export const AddAddressPage = (props: AddAddressPageProps) => {
    let addressRepository = myContainer.get<IAddressRepository>(Symbols.ADDRESS_REPOSITORY)
    let [addressStr, setAddressStr] = useState('')
    let [recipientName, setRecipientName] = useState('')
    let [recipientPhoneNumber, setRecipientPhoneNumber] = useState('')
    let [isCreatingAddress, setIsCreatingAddress] = useState(false)
    let addresses = useAppSelector((state: RootState) => state.addresses.addresses)
    let numberOfAddresses = useAppSelector(state => state.addresses.numberOfAddresses)
    let dispatch = useAppDispatch()
    let [addressErrorMessage, setAddressErrorMessage] = useState('')

    async function saveAddress() {
        if (recipientName != '' && recipientPhoneNumber != '' && addressStr != '') {
            setIsCreatingAddress(true)
            try {
                let newAddress = await addressRepository.createAddress(addressStr, recipientName, recipientPhoneNumber.toString())
                let newAddresses = [...addresses, newAddress] 
                dispatch(setAddreses(newAddresses))
                dispatch(setNumberOfAddresses(numberOfAddresses + 1))
                props.onBack()
            } catch (exception) {
                if (exception instanceof UnsupportedCity) {
                    setAddressErrorMessage('Rất tiếc, chúng tôi hiện không giao được đến thành phố này')
                }
            } finally {
                setIsCreatingAddress(false)
            }
        }
    }

    if (isCreatingAddress) {
        return <Loading></Loading>
    }

    return <section className={ styles.add_address_page }>
        <HeaderBar title="Thêm địa chỉ" onBack={props.onBack}></HeaderBar>
        <div className={ styles.main }>
            <form className={ styles.form }>
                <input value={recipientName} onChange={e => setRecipientName(e.target.value)} placeholder="Tên người nhận"></input>
                <input value={addressStr} onChange={e => setAddressStr(e.target.value)} placeholder="Địa chỉ"></input>
                <p className={ addressErrorMessage.length > 0? styles.error_message : styles.error_message_hidden }>{ addressErrorMessage }</p>
                <PhoneInput value={recipientPhoneNumber} onChange={val => setRecipientPhoneNumber(val)} placeholder="Số điện thoại"></PhoneInput>
            </form>
            <button onClick={ saveAddress }  className={ styles.save_button }>Lưu</button>
        </div>
    </section>
}