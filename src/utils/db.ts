import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Question, Session } from '@/types';
import { INITIAL_QUESTIONS } from '@/data/initialQuestions';

interface QuestionAppDB extends DBSchema {
    questions: {
        key: string;
        value: Question;
        indexes: { 'by-category': string };
    };
    sessions: {
        key: string;
        value: Session;
    };
}

const DB_NAME = 'question-app-db';
const DB_VERSION = 2; // Bump version to trigger upgrade for new questions

let dbPromise: Promise<IDBPDatabase<QuestionAppDB>>;

export const initDB = () => {
    if (!dbPromise) {
        dbPromise = openDB<QuestionAppDB>(DB_NAME, DB_VERSION, {
            upgrade(db, oldVersion, newVersion, transaction) {
                // Questions Store
                if (!db.objectStoreNames.contains('questions')) {
                    const questionStore = db.createObjectStore('questions', { keyPath: 'id' });
                    questionStore.createIndex('by-category', 'categoryId');
                }

                // Re-seed data if upgrading or creating (Simple approach: overwrite existing seed data)
                // Note: In production, we should be careful not to overwrite user data if any.
                // For this app, questions are static locally, so re-seeding is fine.
                const questionStore = transaction.objectStore('questions');
                INITIAL_QUESTIONS.forEach(question => {
                    questionStore.put(question);
                });

                // Sessions Store
                if (!db.objectStoreNames.contains('sessions')) {
                    db.createObjectStore('sessions', { keyPath: 'id' });
                }
            },
        });
    }
    return dbPromise;
};

export const getAllQuestions = async (): Promise<Question[]> => {
    const db = await initDB();
    return db.getAll('questions');
};

export const getQuestionsByCategory = async (categoryId: string): Promise<Question[]> => {
    const db = await initDB();
    return db.getAllFromIndex('questions', 'by-category', categoryId);
};

export const saveSession = async (session: Session): Promise<void> => {
    const db = await initDB();
    await db.put('sessions', session);
};

export const getSession = async (id: string): Promise<Session | undefined> => {
    const db = await initDB();
    return db.get('sessions', id);
};
