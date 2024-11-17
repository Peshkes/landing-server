import {BaseTier} from "../tierTypes";
import BaseTierModel from "../models/baseTierModel";


const addNewBaseTier = async (baseTier: BaseTier) => {
    try {
        const {name, settings} = baseTier;
        const newTier = new BaseTierModel({
            name,
            settings
        });
        await newTier.save();
    } catch (error: any) {
        throw new Error(`Ошибка при создании тира: ${error.message}`);
    }
};


const getBaseTierById = async (id: string): Promise<BaseTier> => {
    try {
        const baseTier: BaseTier | null = await BaseTierModel.findById(id);
        if (!baseTier) throw new Error("Тиры с таким ID: " + id + " не найдено");
        return {
            _id: baseTier._id,
            name: baseTier.name,
            settings: baseTier.settings
        };
    } catch (error: any) {
        throw new Error(`Ошибка при получении тира: ${error.message}`);
    }
};

const getAllBaseTiers = async (): Promise<BaseTier[]> => {
    try {
        const baseTiers: BaseTier[] = await BaseTierModel.find();
        return baseTiers.map(baseTier => ({
            _id: baseTier._id,
            name: baseTier.name,
            settings: baseTier.settings
        }));
    } catch (error: any) {
        throw new Error(`Ошибка при получении списка тиров: ${error.message}`);
    }
};

const deleteBaseTierById = async (id: string): Promise<BaseTier> => {
    try {
        const baseTier: BaseTier | null = await BaseTierModel.findByIdAndDelete(id);
        if (!baseTier) throw new Error("Тира с таким ID: " + id + " не найдено");
        return {
            _id: baseTier._id,
            name: baseTier.name,
            settings: baseTier.settings
        };
    } catch (error: any) {
        throw new Error(`Ошибка при удалении тирай: ${error.message}`);
    }
};

const updateBaseTierById = async (id: string, newBaseTier: BaseTier) => {
    try {
        const salesTier: BaseTier | null = await BaseTierModel.findById(id);
        if (!salesTier) throw new Error("Тира с таким ID: " + id + " не найдено");
        const {name, settings} = newBaseTier;
        await BaseTierModel.updateOne({name, settings});
    } catch (error: any) {
        throw new Error(`Ошибка при обновлении тира: ${error.message}`);
    }
};



export {addNewBaseTier, getAllBaseTiers, deleteBaseTierById, updateBaseTierById, getBaseTierById};