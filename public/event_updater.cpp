#include <iostream>
#include <string>
#include <fstream> // Include fstream for file operations
using namespace std;
string abbreviate(int month) {
    switch(month) {
        case 1: return "Jan";
        case 2: return "Feb";
        case 3: return "Mar";
        case 4: return "Apr";
        case 5: return "May";
        case 6: return "Jun";
        case 7: return "Jul";
        case 8: return "Aug";
        case 9: return "Sep";
        case 10: return "Oct";
        case 11: return "Nov";
        case 12: return "Dec";
        default: return "";
    }
}
int main(){
    cout<<"Enter the event name:";
    string eventName;
    getline(cin, eventName);
    if(eventName.empty()){
        cout<<"Event name cannot be empty."<<endl;
        return 1;
    }
    cout<<"Enter the event date (DD-MM-YYYY):";
    string eventDate;
    getline(cin, eventDate);
    if(eventName.empty() || eventDate.empty()){
        cout<<"Event name or date cannot be empty."<<endl;
        return 1;
    }
    while(eventDate.length() != 10 || eventDate[2] != '-' || eventDate[5] != '-'){
        cout<<"Invalid date format. Please use DD-MM-YYYY."<<endl;
        cout<<"Enter the event date (DD-MM-YYYY):";
        getline(cin, eventDate);
    }
    int month = stoi(eventDate.substr(3, 2));
    // Use fstream to append to data.txt
    ofstream fout("data.txt", ios::app);
    if (!fout) {
        cout << "Failed to open data.txt for writing." << endl;
        return 1;
    }
    fout << eventName << "|" << eventDate.substr(0,2) << " " << abbreviate(month) << "|" << eventDate.substr(6,4) << endl;
    fout.close();
    return 0;
}