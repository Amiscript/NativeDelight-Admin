
// "use client";
// import React, { useEffect, useState } from 'react';
// import AppLayout from '../components/AppLayout';
// import { Button } from '@/components/ui/button';
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from '@/components/ui/alert-dialog';
// import { Input } from '@/components/ui/input';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { Pencil, Trash2 } from 'lucide-react';
// import { fetchSubcategories, addSubcategoryData, updateSubcategoryData, deleteSubcategoryData } from '@/lib/api';
// import { toast } from 'react-toastify';

// interface Subcategory {
//   _id: string;
//   name: string;
// }

// const Subcategories = () => {
//   const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
//   const [newSubcategory, setNewSubcategory] = useState('');
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchSubcategoriesData = async () => {
//       try {
//         const response = await fetchSubcategories();
//         setSubcategories(response);
//       } catch (error) {
//         console.error('Error fetching subcategories:', error);
//         setError('Failed to fetch subcategories');
//       }
//     };
//     fetchSubcategoriesData();
//   }, []);

//   const handleAddSubcategory = async () => {
//     if (!newSubcategory.trim()) {
//       setError('Subcategory name is required');
//       return;
//     }

//     try {
//       if (editingId) {
//         await updateSubcategoryData(editingId, { name: newSubcategory });
//         setSubcategories(
//           subcategories.map((sub) =>
//             sub._id === editingId ? { ...sub, name: newSubcategory } : sub
//           )
//         );
//         setEditingId(null);
//       } else {
//         const response = await addSubcategoryData({ name: newSubcategory });
//         setSubcategories([...subcategories, response]);
//         // add toast mmessage 
//         toast.success('Subcategory added successfully!', {
//         position: 'top-right',
//         autoClose: 3000,
//         });
//       }
//       setNewSubcategory('');
//       setError(null);
//     } catch (error: any) {
//       console.error('Error saving subcategory:', error);
//       setError(error.response?.data?.message || 'Failed to save subcategory');
//         toast.error('Unabe to delete subcategory!', {
//         position: 'top-right',
//         autoClose: 3000,
//         });
//     }
//   };

//   const handleEdit = (subcategory: Subcategory) => {
//     setEditingId(subcategory._id);
//     setNewSubcategory(subcategory.name);
//     setError(null);
//   };

//   const handleDelete = async (id: string) => {
//     try {
//       await deleteSubcategoryData(id);
//       setSubcategories(subcategories.filter((sub) => sub._id !== id));
//       setError(null);
//         toast.success('subcategories deleted successfully!', {
//         position: 'top-right',
//         autoClose: 3000,
//     });    
//     } catch (error: any) {
//       console.error('Error deleting subcategory:', error);
//       setError(error.response?.data?.message || 'Failed to delete subcategory');
//     }
//   };

//   return (
//     <AppLayout>
//       <div className="m-0 p-0">
//         <header className="flex justify-end mb-6 mx-5">
//           <AlertDialog>
//             <AlertDialogTrigger asChild>
//               <Button>Add Subcategory</Button>
//             </AlertDialogTrigger>
//             <AlertDialogContent>
//               <AlertDialogHeader>
//                 <AlertDialogTitle>
//                   {editingId ? 'Edit Subcategory' : 'Add New Subcategory'}
//                 </AlertDialogTitle>
//                 <AlertDialogDescription>
//                   Enter the name of the subcategory below.
//                 </AlertDialogDescription>
//               </AlertDialogHeader>
//               <Input
//                 value={newSubcategory}
//                 onChange={(e) => setNewSubcategory(e.target.value)}
//                 placeholder="Subcategory name"
//                 className="mt-4"
//               />
//               {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
//               <AlertDialogFooter>
//                 <AlertDialogCancel onClick={() => { setEditingId(null); setError(null); }}>
//                   Cancel
//                 </AlertDialogCancel>
//                 <AlertDialogAction onClick={handleAddSubcategory}>
//                   {editingId ? 'Save' : 'Add'}
//                 </AlertDialogAction>
//               </AlertDialogFooter>
//             </AlertDialogContent>
//           </AlertDialog>
//         </header>

//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Name</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {subcategories.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={2} className="text-center">
//                   No subcategories found
//                 </TableCell>
//               </TableRow>
//             ) : (
//               subcategories.map((subcategory) => (
//                 <TableRow key={subcategory._id}>
//                   <TableCell>{subcategory.name}</TableCell>
//                   <TableCell className="text-right">
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       onClick={() => handleEdit(subcategory)}
//                     >
//                       <Pencil className="h-4 w-4" />
//                     </Button>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       onClick={() => handleDelete(subcategory._id)}
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>
//     </AppLayout>
//   );
// };

// export default Subcategories;




"use client";
import React, { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import { Button } from '@/components/ui/button';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trash2 } from 'lucide-react';
import { fetchSubcategories, addSubcategoryData, deleteSubcategoryData } from '@/lib/api';
import { toast } from 'react-toastify';
import EditSubcategoryModal from '../components/subcategory/EditSubcategory';

interface Subcategory {
  _id: string;
  name: string;
}

const Subcategories = () => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [newSubcategory, setNewSubcategory] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubcategoriesData = async () => {
      try {
        const response = await fetchSubcategories();
        setSubcategories(response);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
        setError('Failed to fetch subcategories');
      }
    };
    fetchSubcategoriesData();
  }, []);

  const handleAddSubcategory = async () => {
    if (!newSubcategory.trim()) {
      setError('Subcategory name is required');
      return;
    }

    try {
      const response = await addSubcategoryData({ name: newSubcategory });
      setSubcategories([...subcategories, response]);
      toast.success('Subcategory added successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
      setNewSubcategory('');
      setError(null);
    } catch (error: any) {
      console.error('Error saving subcategory:', error);
      setError(error.response?.data?.message || 'Failed to save subcategory');
      toast.error('Unable to add subcategory!', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleUpdateSubcategory = (updatedSubcategory: Subcategory) => {
    setSubcategories(
      subcategories.map((sub) =>
        sub._id === updatedSubcategory._id ? updatedSubcategory : sub
      )
    );
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSubcategoryData(id);
      setSubcategories(subcategories.filter((sub) => sub._id !== id));
      toast.success('Subcategory deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
      setError(null);
    } catch (error: any) {
      console.error('Error deleting subcategory:', error);
      setError(error.response?.data?.message || 'Failed to delete subcategory');
      toast.error('Unable to delete subcategory!', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <AppLayout>
      <div className="m-0 p-0">
        <header className="flex justify-end mb-6 mx-5">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>Add Subcategory</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Add New Subcategory</AlertDialogTitle>
                <AlertDialogDescription>
                  Enter the name of the subcategory below.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <Input
                value={newSubcategory}
                onChange={(e) => setNewSubcategory(e.target.value)}
                placeholder="Subcategory name"
                className="mt-4"
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setError(null)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleAddSubcategory}>
                  Add
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </header>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subcategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center">
                  No subcategories found
                </TableCell>
              </TableRow>
            ) : (
              subcategories.map((subcategory) => (
                <TableRow key={subcategory._id}>
                  <TableCell>{subcategory.name}</TableCell>
                  <TableCell className="text-right">
                    <EditSubcategoryModal
                      subcategory={subcategory}
                      onUpdate={handleUpdateSubcategory}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(subcategory._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
};

export default Subcategories;