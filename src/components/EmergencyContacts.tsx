
import { useState } from "react";
import { Phone, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Contact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

const EmergencyContacts = () => {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'Mom', phone: '+1 (555) 123-4567', relationship: 'Mother' },
    { id: '2', name: 'Best Friend Sarah', phone: '+1 (555) 987-6543', relationship: 'Friend' }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '' });

  const handleAddContact = () => {
    if (newContact.name && newContact.phone) {
      const contact: Contact = {
        id: Date.now().toString(),
        ...newContact
      };
      setContacts([...contacts, contact]);
      setNewContact({ name: '', phone: '', relationship: '' });
      setShowAddForm(false);
      toast({
        title: "Contact Added",
        description: `${newContact.name} has been added to your emergency contacts.`,
      });
    }
  };

  const handleRemoveContact = (id: string) => {
    setContacts(contacts.filter(contact => contact.id !== id));
    toast({
      title: "Contact Removed",
      description: "Emergency contact has been removed.",
    });
  };

  const handleCallContact = (contact: Contact) => {
    toast({
      title: "Calling Emergency Contact",
      description: `Calling ${contact.name} at ${contact.phone}`,
    });
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Phone className="w-5 h-5 text-purple-500" />
            <span>Emergency Contacts</span>
          </div>
          <Button
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-purple-500 hover:bg-purple-600"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Contact Form */}
        {showAddForm && (
          <div className="space-y-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                placeholder="Enter contact name"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <Label htmlFor="relationship">Relationship</Label>
              <Input
                id="relationship"
                value={newContact.relationship}
                onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                placeholder="e.g., Friend, Family, Partner"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleAddContact} size="sm" className="bg-green-500 hover:bg-green-600">
                Add Contact
              </Button>
              <Button 
                onClick={() => setShowAddForm(false)} 
                size="sm" 
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Contacts List */}
        <div className="space-y-3">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">{contact.name}</h4>
                <p className="text-sm text-gray-600">{contact.phone}</p>
                {contact.relationship && (
                  <p className="text-xs text-purple-600">{contact.relationship}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleCallContact(contact)}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <Phone className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRemoveContact(contact.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {contacts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Phone className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No emergency contacts added yet.</p>
            <p className="text-sm">Add contacts to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmergencyContacts;
