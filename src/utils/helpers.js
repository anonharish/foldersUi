// Utility function to find a folder by ID (optional, but useful)
export const getFileType = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    const typeMap = {
        'pdf': 'pdf',
        'doc': 'doc',
        'docx': 'doc',
        'txt': 'txt',
        'xls': 'excel',
        'xlsx': 'excel',
        'csv': 'excel',
        'jpg': 'image',
        'jpeg': 'image',
        'png': 'image',
        'gif': 'image',
        'mp4': 'video',
        'mov': 'video',
        'avi': 'video',
        'mp3': 'audio',
        'wav': 'audio',
    };
    return typeMap[extension] || 'file';
};

export const findFolderById = (folders, id) => {
    for (const folder of folders) {
        if (folder.id === id) {
            return folder;
        }
        if (folder.children && folder.children.length > 0) {
            const found = findFolderById(folder.children, id);
            if (found) return found;
        }
    }
    return null;
};


// Main recursive function to add folder
export const addFolderToStructure = (folders, newFolder, parentId = null) => {
    // If parentId is null, add to root level
    if (parentId === null) {
        return [...folders, newFolder];
    }

    // Recursively search for the parent folder
    return folders.map(folder => {
        if (folder.id === parentId) {
            // Found the parent folder, add the new folder to its children
            return {
                ...folder,
                children: [...folder.children, newFolder]
            };
        } else if (folder.children && folder.children.length > 0) {
            // Recursively search in children
            return {
                ...folder,
                children: addFolderToStructure(folder.children, newFolder, parentId)
            };
        }
        return folder;
    });
};

export const updateFolderWithFiles = (folders, targetFolderId, newFiles) => {
    return folders.map(folder => {
        if (folder.id === targetFolderId) {
            // Found the target folder, add files to it
            return {
                ...folder,
                files: [
                    ...folder.files,
                    ...newFiles.map(file => ({
                        id: Date.now() + Math.random(),
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        uploadedAt: new Date().toISOString(),
                        url: "#",
                        typeofFile: getFileType(file.name),
                    }))
                ]
            };
        } else if (folder.children && folder.children.length > 0) {
            // Recursively search in children
            return {
                ...folder,
                children: updateFolderWithFiles(folder.children, targetFolderId, newFiles)
            };
        }
        return folder;
    });
};

export const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};