import csv

f = open('clinic_data.js', 'w')
f.write("var clinic_data01 = [")

with open('clinics.csv', 'rb') as csvfile:
    reader = csv.reader(csvfile)
    for idx, row in enumerate(reader):
        f.write("[");
        line = ""
        if (idx == 0):
            for word in row:
                line = line + "'" + word +"',";
        else:
            for idx2, word in enumerate(row):
                if (idx2 == 0):
                    line = line + "'" + word + "'," 
                else:
                    line = line + word + ",";
        line = line[:-1]
        f.write(line)
        f.write("],\n")

f.write("];")
f.close()