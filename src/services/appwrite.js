import { Client, Databases, Storage, ID } from 'appwrite';
import { appwriteConfig } from '../config/appwrite';

const client = new Client();
client
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('67fac3a300196a7fe2fb');

const databases = new Databases(client);
const storage = new Storage(client);

export const appwriteService = {
    // Skills
    async getFrontendSkills() {
        try {
            console.log('Fetching frontend skills...');
            const response = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.frontendSkillsCollectionId
            );
            console.log('Frontend skills response:', response);
            return response.documents;
        } catch (error) {
            console.error('Error fetching frontend skills:', error);
            console.error('Database ID:', appwriteConfig.databaseId);
            console.error('Collection ID:', appwriteConfig.frontendSkillsCollectionId);
            return null;
        }
    },

    async getBackendSkills() {
        try {
            const response = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.backendSkillsCollectionId
            );
            return response.documents;
        } catch (error) {
            console.error('Error fetching backend skills:', error);
            return null;
        }
    },

    

    async getSoftSkills() {
        try {
            const response = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.softSkillsCollectionId
            );
            return response.documents;
        } catch (error) {
            console.error('Error fetching soft skills:', error);
            return null;
        }
    },

    // Projects
    async getProjects() {
        try {
            const response = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.projectsCollectionId
            );
            return response.documents;
        } catch (error) {
            console.error('Appwrite service error:', error);
            throw error;
        }
    },

    async getProject(projectId) {
        try {
            return await databases.getDocument(
                appwriteConfig.databaseId,
                appwriteConfig.projectsCollectionId,
                projectId
            );
        } catch (error) {
            console.error('Appwrite service error:', error);
            throw error;
        }
    },

    // Profile Image
    async uploadProfileImage(file) {
        try {
            return await storage.createFile(
                appwriteConfig.bucketId,
                ID.unique(),
                file
            );
        } catch (error) {
            console.error('Appwrite service error:', error);
            throw error;
        }
    },

    async getProfileImage(fileId) {
        try {
            return storage.getFileView(
                appwriteConfig.bucketId,
                fileId
            );
        } catch (error) {
            console.error('Appwrite service error:', error);
            throw error;
        }
    },

    async updateProfileImage(oldFileId, newFile) {
        try {
            // Delete old image if it exists
            if (oldFileId) {
                await storage.deleteFile(
                    appwriteConfig.bucketId,
                    oldFileId
                );
            }
            // Upload new image
            return await this.uploadProfileImage(newFile);
        } catch (error) {
            console.error('Appwrite service error:', error);
            throw error;
        }
    }
};
