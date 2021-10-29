import React, { useEffect, useState } from "react"
import { AddAddressPageZ } from "../../config/ZIndex"
import { useAppSelector } from "../../hooks/Hooks"
import { Address } from "../../models/Address"
import { EStatus } from "../../models/StatusModel"
import { HeaderBar } from "../components/HeaderBar"
import Loading from "../components/Loading"
import { PageTransition } from "../components/PageTransition"
import { withAddresses } from "../hocs/withAddresses"
import { AddAddressPage } from "./AddAddressPage"
import { AddressCard } from "./AddressCard"
import styles from './AddressPage.module.scss'

export interface AddressPageProps {
    onBack() : void,
    onAddressSelected(address: Address) : void,
}

const AddressPage = (props: AddressPageProps) => {
    let addresses = useAppSelector(state => state.addresses.addresses)
    let addressOperationStatus = useAppSelector(state => state.addresses.operationStatus)
    let [isLoading, setIsLoading] = useState(false)
    let [showAddAddressPage, setShowAddAddressPage] = useState(false)

    useEffect(() => {
        if (addressOperationStatus.status === EStatus.IN_PROGRESS) {
            setIsLoading(true)
        } else {
            setIsLoading(false)
        }
    }, [addressOperationStatus])

    function buildAddresses() : React.ReactNode[] {
        let ret = []
        for (let i = 0; i < addresses.length; i++) {
            ret.push(<AddressCard key={i} address={addresses[i]} onSelected={() => props.onAddressSelected(addresses[i])}></AddressCard>)
        }
        return ret
    }

    return <React.Fragment>
        <PageTransition show={ showAddAddressPage } zIndex={ AddAddressPageZ }>
            <AddAddressPage onBack={() => setShowAddAddressPage(false)}></AddAddressPage>
        </PageTransition>
        <section className={ styles.address_page }>
            <HeaderBar title="Địa chỉ giao hàng" onBack={props.onBack}></HeaderBar>
            <div className={ styles.addresses }>
                {(() => {
                    if (isLoading) {
                        return <Loading></Loading>
                    } else {
                        return buildAddresses() 
                    }
                })()}
            </div>

            <div className={ addresses.length == 0? styles.add_adddress_button_center_container : ''}>
                <button className={ styles.add_adddress_button } onClick={() => setShowAddAddressPage(true)}> + Thêm địa chỉ </button> 
            </div>
        </section>
    </React.Fragment>
}

const AddressPageWithAddresses = withAddresses(AddressPage)
export default AddressPageWithAddresses
