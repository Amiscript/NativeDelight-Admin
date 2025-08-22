import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { updateSubcategoryData } from '@/lib/api';
import { toast } from 'react-toastify';

interface Subcategory {
  _id: string;
  name: string;
}

interface EditSubcategoryModalProps {
  subcategory: Subcategory;
  onUpdate: (updatedSubcategory: Subcategory) => void;
}

const EditSubcategoryModal: React.FC<EditSubcategoryModalProps> = ({ subcategory, onUpdate }) => {
  const [editName, setEditName] = useState(subcategory.name);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async () => {
    if (!editName.trim()) {
      setError('Subcategory name is required');
      return;
    }

    try {
      const response = await updateSubcategoryData(subcategory._id, { name: editName });
      onUpdate(response);
      toast.success('Subcategory updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
      setError(null);
    } catch (error: any) {
      console.error('Error updating subcategory:', error);
      setError(error.response?.data?.message || 'Failed to update subcategory');
      toast.error('Unable to update subcategory!', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Subcategory</AlertDialogTitle>
          <AlertDialogDescription>
            Update the name of the subcategory below.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Input
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          placeholder="Subcategory name"
          className="mt-4"
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setError(null)}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleUpdate}>Save</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditSubcategoryModal;