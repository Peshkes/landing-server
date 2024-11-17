import {SalesTier} from "../tierTypes";
import SalesTierModel from "../models/salesTierModel";


const addNewSalesTier = async (salesTier: SalesTier) => {
    try {
        const {name, duration, price, base_tier, sales_price, expiration_date} = salesTier;
        const newTier = new SalesTierModel({
            name,
            duration,
            price,
            base_tier,
            sales_price: sales_price && sales_price,
            expiration_date: expiration_date ? expiration_date : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });
        await newTier.save();
    } catch (error: any) {
        throw new Error(`Ошибка при создании тира: ${error.message}`);
    }
};


const getSalesTierById = async (id: string): Promise<SalesTier> => {
    try {
        const salesTier: SalesTier | null = await SalesTierModel.findById(id);
        if (!salesTier) throw new Error("Тиры с таким ID: " + id + " не найдено");
        return {
            _id: salesTier._id,
            name: salesTier.name,
            duration: salesTier.duration,
            price: salesTier.price,
            base_tier: salesTier.base_tier,
            sales_price: salesTier.sales_price,
            expiration_date: salesTier.expiration_date
        };
    } catch (error: any) {
        throw new Error(`Ошибка при получении тира: ${error.message}`);
    }
};

const getAllSalesTiers = async (): Promise<SalesTier[]> => {
    try {
        const salesTiers: SalesTier[] = await SalesTierModel.find();
        return salesTiers.map(salesTier => ({
            _id: salesTier._id,
            name: salesTier.name,
            duration: salesTier.duration,
            price: salesTier.price,
            base_tier: salesTier.base_tier,
            sales_price: salesTier.sales_price,
            expiration_date: salesTier.expiration_date
        }));
    } catch (error: any) {
        throw new Error(`Ошибка при получении списка тиров: ${error.message}`);
    }
};

const deleteSalesTierById = async (id: string): Promise<SalesTier> => {
    try {
        const salesTier: SalesTier | null = await SalesTierModel.findByIdAndDelete(id);
        if (!salesTier) throw new Error("Тира с таким ID: " + id + " не найдено");
        return {
            _id: salesTier._id,
            name: salesTier.name,
            duration: salesTier.duration,
            price: salesTier.price,
            base_tier: salesTier.base_tier,
            sales_price: salesTier.sales_price,
            expiration_date: salesTier.expiration_date
        };
    } catch (error: any) {
        throw new Error(`Ошибка при удалении тирай: ${error.message}`);
    }
};

const updateSalesTierById = async (id: string, newSalesTier: SalesTier) => {
    try {
        const salesTier: SalesTier | null = await SalesTierModel.findById(id);
        if (!salesTier) throw new Error("Тира с таким ID: " + id + " не найдено");
        const {name, duration, price, base_tier, sales_price, expiration_date} = newSalesTier;
        await SalesTierModel.updateOne({name, duration, price, base_tier, sales_price, expiration_date});
    } catch (error: any) {
        throw new Error(`Ошибка при обновлении тира: ${error.message}`);
    }
};



export {addNewSalesTier, getSalesTierById, getAllSalesTiers, deleteSalesTierById, updateSalesTierById};