#include <iostream>
#include <vector>
#include <string>



class Data {
public:
    std::string name;
    int value;
    Data(std::string n, int v) : name(n), value(v) {}
};




class Container {
private:
    std::vector<Data*> dataList;

public:
    void addData(Data* data) {
        dataList.push_back(data);
    }

    Data* findData(const std::string& name) {
        for (auto data : dataList) {
            if (data && data->name == name) {
                return data;
            }
        }
        return nullptr; 
    }
};

class Processor {
private:
    Container* container;

public:
    Processor(Container* c) : container(c) {}

    void processData(const std::string& name) {
        Data* data = container->findData(name);
        
        std::cout << "Processing data: " << data->name << ", value: " << data->value << std::endl;
    }
};

int main() {
    Container container;
    container.addData(new Data("item1", 10));
    container.addData(new Data("item2", 20));

    Processor processor(&container);
    processor.processData("item1");
    processor.processData("item3"); 

    return 0;
}