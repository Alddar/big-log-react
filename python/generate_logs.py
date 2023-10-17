import datetime
from random import randint
from wonderwords import RandomSentence

def main():
    s = RandomSentence()
    now = datetime.datetime.now()
    with open("./public/log/log1.log", "w") as f:
        for i in range(0, 50000):
            now = now + datetime.timedelta(milliseconds=randint(1,500))
            newline = "\n"
            f.write(f"{str(now)} {s.sentence()}\n")
        
    now = datetime.datetime.now() + datetime.timedelta(minutes=10)
    with open("./public/log/log2.log", "w") as f:
        for i in range(0, 50000):
            now = now + datetime.timedelta(milliseconds=randint(1,500))
            newline = "\n"
            f.write(f"{str(now)} {s.sentence()}\n")
    

if __name__ == "__main__":
    main()
